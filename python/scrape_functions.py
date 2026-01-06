from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
import pandas as pd
import time

# Base driver setup with context manager
class FirefoxDriver:
    def __init__(self, width=1920, height=13500):
        self.width = width
        self.height = height
        self.driver = None
    
    def __enter__(self):
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        
        self.driver = webdriver.Firefox(options=options)
        self.driver.set_window_size(self.width, self.height)
        return self.driver
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.driver:
            self.driver.quit()

# Generic scraping function
def scrape_page(url, height, element_class, extractor_func):
    """
    Generic scraper that handles driver setup and element extraction.
    
    Args:
        url: URL to scrape
        height: Window height for driver
        element_class: CSS class name of elements to find
        extractor_func: Function to extract data from each element
    """
    try:
        with FirefoxDriver(height=height) as driver:
            driver.get(url)
            time.sleep(5)
            
            elements = driver.find_elements(By.CLASS_NAME, element_class)
            data_list = [extractor_func(el) for el in elements]
            
            return pd.DataFrame(data_list)
    except Exception as e:
        print(e)
        return pd.DataFrame()

# Extractor functions for each data type
def extract_move_data(m):
    return {
        'name': m.find_element(By.CSS_SELECTOR, "div.MoveRow-name").text,
        'type': m.find_element(By.CSS_SELECTOR, "div.MoveRow-type").text,
        'damage_type': m.find_element(By.CSS_SELECTOR, "div.damage-category-block").get_attribute("class").split()[-1],
        'power': m.find_element(By.CSS_SELECTOR, "div.MoveRow-power > span").text,
        'accuracy': m.find_element(By.CSS_SELECTOR, "div.MoveRow-accuracy > span").text,
        'pp': m.find_element(By.CSS_SELECTOR, "div.MoveRow-pp > span").text,
        'description': m.find_element(By.CSS_SELECTOR, "div.MoveRow-description").text
    }

def extract_pokemon_data(mon):
    type_list = mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-types").text.splitlines()
    ability_list = mon.find_elements(By.CLASS_NAME, "AbilityList")
    
    # Process types
    if len(type_list) == 1:
        type_list = type_list[0]
    
    # Process abilities
    if len(ability_list) > 1 and ability_list[1].text != "":
        ability_list = [ability_list[0].text, ability_list[1].text]
    else:
        ability_list = ability_list[0].text
    
    return {
        'name': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-name").text,
        'type': type_list,
        'ability': ability_list,
        'hp': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-hp").text.split("\n")[1],
        'attack': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-atk").text.split("\n")[1],
        'defense': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-def").text.split("\n")[1],
        'special_attack': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-spa").text.split("\n")[1],
        'special_defense': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-spd").text.split("\n")[1],
        'speed': mon.find_element(By.CSS_SELECTOR, "div.PokemonAltRow-spe").text.split("\n")[1]
    }

def extract_ability_data(ab):
    return {
        'name': ab.find_element(By.CSS_SELECTOR, "div.AbilityRow-name").text,
        'description': ab.find_element(By.CSS_SELECTOR, "div.AbilityRow-description").text
    }

def extract_item_data(it):
    return {
        'name': it.find_element(By.CSS_SELECTOR, "div.ItemRow-name").text,
        'description': it.find_element(By.CSS_SELECTOR, "div.ItemRow-description").text
    }

# Main scraping functions
def scrape_moves(url):
    return scrape_page(url, 13500, "MoveRow", extract_move_data)

def scrape_pokemon(url):
    return scrape_page(url, 14800, "PokemonAltRow", extract_pokemon_data)

def scrape_abilities(url):
    return scrape_page(url, 3150, "AbilityRow", extract_ability_data)

def scrape_items(url):
    return scrape_page(url, 4650, "ItemRow", extract_item_data)

# Japanese name scrapers
def scrape_pokemon_jp(url):
    try:
        with FirefoxDriver(height=13000) as driver:
            driver.get(url)
            time.sleep(5)
            
            tables = driver.find_elements(By.XPATH, "/html/body/div[1]/div[2]/div[1]/div[3]/div[4]/div[1]/table")
            
            pokemons = []
            for table in tables[:3]:
                curr_gen = table.find_elements(By.TAG_NAME, "tr")
                pokemons.extend(curr_gen[2:])
                time.sleep(5)
            
            pokemon_list = []
            for mon in pokemons:
                cells = mon.find_elements(By.TAG_NAME, "td")
                eng_name = cells[2].text.strip()
                
                # Handle special characters
                if eng_name == 'Nidoran♂':
                    eng_name = 'Nidoran-M'
                elif eng_name == 'Nidoran♀':
                    eng_name = 'Nidoran-F'
                
                pokemon_list.append({
                    'dex_entry': cells[0].text.strip(),
                    'eng_name': eng_name,
                    'kanji': cells[3].text.strip(),
                    'hepburn': cells[4].text.strip()
                })
            
            return pd.DataFrame(pokemon_list)
    except Exception as e:
        print(e)
        return pd.DataFrame()

def scrape_jp_names(url, reference_df, name_corrections=None):
    """
    Generic function to scrape Japanese names from Bulbapedia.
    
    Args:
        url: URL to scrape
        reference_df: DataFrame with 'name' column to filter against
        name_corrections: Dict of name corrections (optional)
    """
    try:
        with FirefoxDriver(height=13000) as driver:
            driver.get(url)
            time.sleep(5)
            
            table = driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/div[1]/div[3]/div[4]/div[1]/table[2]")
            rows = driver.find_elements(By.TAG_NAME, "tr")
            
            data_list = []
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                
                if len(cells) > 2:
                    eng_name = cells[1].text.strip()
                    
                    # Remove asterisks
                    eng_name = eng_name.rstrip('*')
                    
                    # Apply name corrections
                    if name_corrections and eng_name in name_corrections:
                        eng_name = name_corrections[eng_name]
                    
                    # Only include if in reference DataFrame
                    if eng_name in reference_df['name'].values:
                        data_list.append({
                            'eng_name': eng_name,
                            'kanji': cells[2].text.strip(),
                            'hepburn': cells[3].text.strip()
                        })
            
            df = pd.DataFrame(data_list)
            return df.sort_values('eng_name')
    except Exception as e:
        print(e)
        return pd.DataFrame()

def scrape_moves_jp(url, move_df):
    corrections = {'Vise Grip': 'Vice Grip'}
    return scrape_jp_names(url, move_df, corrections)

def scrape_abilities_jp(url, abilities_df):
    return scrape_jp_names(url, abilities_df)

def scrape_items_jp(url, items_df):
    corrections = {
        'Upgrade': 'Up-Grade',
        'Poké Ball': 'Poke Ball'
    }
    return scrape_jp_names(url, items_df, corrections)
