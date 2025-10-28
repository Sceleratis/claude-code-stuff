"""Context management module for loading, saving, and modifying context data."""
import json


def load_context() -> dict:
    """Load context data from a JSON file.
    
    Returns:
        dict: The loaded context data.
    """
    with open('context.json', 'r') as f:
        data = json.load(f)
    return data

def save_context(context: dict) -> None:
    """Save context data to a JSON file.
    
    Args:
        context: The context data to save.
    """
    with open('context.json', 'w') as f:
        json.dump(context, f)

def add_context(context: dict, key: str) -> dict:
    """Add a new key-value pair to the context.
    
    Args:
        context: The context dictionary to modify.
        key: The key to add.
        
    Returns:
        dict: The modified context dictionary.
    """
    context[key] = "value"
    return context

def remove_context(context: dict, key: str) -> dict:
    """Remove a key from the context.
    
    Args:
        context: The context dictionary to modify.
        key: The key to remove.
        
    Returns:
        dict: The modified context dictionary.
    """
    del context[key]
    return context

def main() -> None:
    """Main function to demonstrate context management operations."""
    context = load_context()
    context = add_context(context, "new_key")
    context = remove_context(context, "old_key")
    save_context(context)

if __name__ == "__main__":
    main()
