import re
from typing import Dict, Any, List

def parse_natural_language_query(query: str) -> Dict[str, Any]:
    """
    Parses intent, price caps, materials, and categories from NL search query.
    Example: "Find stainless steel centrifugal pumps under 300000"
    """
    query_lower = query.lower()
    
    # Price detection (e.g. under 300000, under 3 lakh, < 2.5L)
    max_price = None
    min_price = None

    price_match = re.search(r'(?:under|less than|below|<|upto)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|l|k|cr)?', query_lower)
    if price_match:
        val = float(price_match.group(1))
        unit = price_match.group(2)
        if unit in ['lakh', 'l']:
            max_price = val * 100000
        elif unit == 'cr':
            max_price = val * 10000000
        elif unit == 'k':
            max_price = val * 1000
        else:
            max_price = val

    # Material detection
    materials = ["stainless steel", "cast iron", "carbon steel", "brass", "titanium", "aluminum", "alloy steel"]
    detected_material = None
    for m in materials:
        if m in query_lower:
            detected_material = m.title()
            break

    # Category detection
    categories = ["pumps", "valves", "motors", "bearings", "compressors", "generators", "sensors", "controllers", "robotics", "cables", "transformers"]
    detected_category = None
    for c in categories:
        if c in query_lower:
            detected_category = c.title()
            break

    return {
        "raw_query": query,
        "category": detected_category,
        "material": detected_material,
        "max_price": max_price,
        "min_price": min_price,
        "keywords": [w for w in query_lower.split() if len(w) > 2]
    }

def rank_products_semantically(products: List[Any], parsed: Dict[str, Any]) -> List[Any]:
    """
    Ranks products by matching category, material, price constraints, and name keyword overlap.
    """
    scored_products = []
    keywords = set(parsed.get("keywords", []))

    for p in products:
        score = p.ai_score
        
        # Category bonus
        if parsed.get("category") and parsed["category"].lower() in p.category.lower():
            score += 15
        
        # Material bonus
        if parsed.get("material") and parsed["material"].lower() in p.material.lower():
            score += 10

        # Price constraint boost
        if parsed.get("max_price"):
            if p.price <= parsed["max_price"]:
                score += 10
            else:
                score -= 30

        # Word overlap
        p_text = f"{p.name} {p.brand} {p.description} {p.material} {p.application}".lower()
        matches = sum(1 for kw in keywords if kw in p_text)
        score += matches * 2

        scored_products.append((score, p))

    scored_products.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in scored_products]
