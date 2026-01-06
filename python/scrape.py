import scrape_functions as sf
import time

# URL Configuration
URLS = {
    'moves': 'https://www.smogon.com/dex/rs/moves/',
    'pokemon': 'https://www.smogon.com/dex/rs/pokemon/',
    'abilities': 'https://www.smogon.com/dex/rs/abilities/',
    'items': 'https://www.smogon.com/dex/rs/items/',
    'jp_names': 'https://bulbapedia.bulbagarden.net/wiki/List_of_Japanese_Pok%C3%A9mon_names',
    'jp_moves': 'https://bulbapedia.bulbagarden.net/wiki/List_of_moves_in_other_languages',
    'jp_abilities': 'https://bulbapedia.bulbagarden.net/wiki/List_of_Abilities_in_other_languages',
    'jp_items': 'https://bulbapedia.bulbagarden.net/wiki/List_of_items_in_other_languages'
}

OUTPUT_DIR = '../scraped_data/'

# Scraping configuration: (scrape_function, url_key, output_filename, dependencies)
SCRAPE_TASKS = [
    # English data (no dependencies)
    (sf.scrape_moves, 'moves', 'moves.csv', None),
    (sf.scrape_pokemon, 'pokemon', 'pokemon.csv', None),
    (sf.scrape_abilities, 'abilities', 'abilities.csv', None),
    (sf.scrape_items, 'items', 'items.csv', None),
    (sf.scrape_pokemon_jp, 'jp_names', 'jp_names.csv', None),
    # Japanese data (with dependencies)
    (sf.scrape_moves_jp, 'jp_moves', 'jp_moves.csv', 'moves'),
    (sf.scrape_abilities_jp, 'jp_abilities', 'jp_abilities.csv', 'abilities'),
    (sf.scrape_items_jp, 'jp_items', 'jp_items.csv', 'items')
]

def scrape_and_save(func, url, output_path, dependency_data=None):
    """
    Execute a scrape function and save results to CSV.
    
    Args:
        func: Scraping function to call
        url: URL to scrape
        output_path: Path to save CSV file
        dependency_data: Optional dataframe dependency for the scraping function
    """
    print(f"Scraping {output_path}...")
    
    if dependency_data is not None:
        df = func(url, dependency_data)
    else:
        df = func(url)
    
    df.to_csv(output_path, index=False)
    print(f"Saved to {output_path}")

def main():
    """Execute all scraping tasks in order."""
    scraped_data = {}
    
    for i, (func, url_key, filename, dependency_key) in enumerate(SCRAPE_TASKS):
        # Add delay after Japanese names to be polite to Bulbapedia
        if i == 5:  # After jp_names
            print("Waiting 30 seconds before continuing...")
            time.sleep(30)
        
        url = URLS[url_key]
        output_path = OUTPUT_DIR + filename
        dependency_data = scraped_data.get(dependency_key)
        
        scrape_and_save(func, url, output_path, dependency_data)
        
        # Store data for potential dependencies
        if dependency_key is None:
            import pandas as pd
            scraped_data[url_key] = pd.read_csv(output_path)
    
    print("\nAll scraping tasks completed!")

if __name__ == "__main__":
    main()
