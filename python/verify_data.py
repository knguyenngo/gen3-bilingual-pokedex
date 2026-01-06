import pandas as pd

# Import csv files
DATA_FILES = {
    'pokemon': '../scraped_data/pokemon.csv',
    'moves': '../scraped_data/moves.csv',
    'abilities': '../scraped_data/abilities.csv',
    'items': '../scraped_data/items.csv',
    'jp_names': '../scraped_data/jp_names.csv',
    'jp_moves': '../scraped_data/jp_moves.csv',
    'jp_abilities': '../scraped_data/jp_abilities.csv',
    'jp_items': '../scraped_data/jp_items.csv'
}

# Load all dataframes
data = {name: pd.read_csv(path) for name, path in DATA_FILES.items()}

# Drop unwanted rows
DROP_RULES = {
    'pokemon': [
        "Deoxys-Attack",
        "Deoxys-Defense",
        "Deoxys-Speed",
        "Castform-Rainy",
        "Castform-Snowy",
        "Castform-Sunny"
    ],
    'items': [
        "Mail",
        "No Item",
        "Stick"
    ]
}

def drop_rows(df, names):
    """Drop rows where 'name' column matches any value in names list."""
    return df[~df['name'].isin(names)]

# Apply drop rules
for df_name, drop_names in DROP_RULES.items():
    data[df_name] = drop_rows(data[df_name], drop_names)

# Validation function
def validate_match(eng_df, jp_df, eng_col='name', jp_col='eng_name', data_type='items'):
    """
    Validate that English and Japanese dataframes have matching entries.
    
    Args:
        eng_df: English dataframe
        jp_df: Japanese dataframe
        eng_col: Column name in English df (default: 'name')
        jp_col: Column name in Japanese df (default: 'eng_name')
        data_type: Description of data being validated
    
    Returns:
        tuple: (all_matched: bool, missed: list)
    """
    print(f"Checking if {data_type} lists are equal")
    
    eng_values = set(eng_df[eng_col].values)
    jp_values = set(jp_df[jp_col].values)
    
    missed = list(jp_values - eng_values) if eng_col == 'name' else list(eng_values - jp_values)
    all_matched = len(eng_values) == len(jp_values) and len(missed) == 0
    
    if all_matched:
        print(f"All {data_type} matched")
    else:
        print(f"Missed {data_type}:")
        print(missed)
    
    return all_matched, missed

# Run validations
validations = [
    (data['jp_names'], data['pokemon'], 'eng_name', 'name', 'pokemon'),
    (data['jp_moves'], data['moves'], 'eng_name', 'name', 'moves'),
    (data['jp_abilities'], data['abilities'], 'eng_name', 'name', 'abilities'),
    (data['items'], data['jp_items'], 'name', 'eng_name', 'items')
]

results = {}
for jp_df, eng_df, jp_col, eng_col, name in validations:
    results[name] = validate_match(eng_df, jp_df, eng_col, jp_col, name)
