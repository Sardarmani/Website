import os
import re

files = [
    "pia-psx.html",
    "ogdc_investor_analysis.html",
    "system_ltd.html",
    "mapleLeaf.html",
    "terms-and-conditions.html",
    "disclaimer.html",
    "privacy-policy.html",
    "faujiCement.html",
    "careers.html",
    "cookie-policy.html",
    "psx-searl.html"
]

base_dir = "/home/sardar/Desktop/projects/companyWebsite/IT-Company-Website"

replacement_template = """
                    <div class="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-chart-line text-white text-lg"></i>
                        <div class="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
"""

# Regex to match the img tag with flexible whitespace
# <img src="./images/mantrix_edge_logo.png" alt="MantrixEdge Logo"
#                         class="h-10 w-auto transition-transform group-hover:scale-110">
regex_pattern = r'(<img\s+src="\./images/mantrix_edge_logo\.png"\s+alt="MantrixEdge Logo"\s+class="h-10 w-auto transition-transform group-hover:scale-110">)'

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue

    with open(filepath, 'r') as f:
        content = f.read()

    # We need to capture the indentation of the match to apply it to the replacement
    # But regex search doesn't easily give us the indentation of the line.
    # Instead, let's find the match, see the indentation, and adjust.
    
    # Actually, the replacement is a div that replaces the img.
    # The img tag might be on multiple lines.
    # Let's try to match the specific multi-line string if possible, or use regex with DOTALL.
    
    # Construct a regex that matches the img tag, handling the newline and spaces.
    # The class attribute is on a new line in the observed files.
    
    pattern = re.compile(r'(\s*)<img src="\./images/mantrix_edge_logo\.png" alt="MantrixEdge Logo"\s*\n\s*class="h-10 w-auto transition-transform group-hover:scale-110">', re.MULTILINE)
    
    def replace_func(match):
        indent = match.group(1)
        # We want to indent the replacement content properly.
        # The replacement_template has its own indentation (relative to start).
        # We should strip the template and apply the file's indentation.
        
        # Clean up template
        lines = replacement_template.strip().split('\n')
        indented_lines = [indent + line.strip() for line in lines]
        return '\n'.join(indented_lines)

    new_content, count = pattern.subn(replace_func, content)
    
    if count > 0:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"No match found in {filename}")
