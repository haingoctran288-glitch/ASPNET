import os

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\asp-net-main\asp-net-main\CMS.Backend\Views"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file in ["Create.cshtml", "Edit.cshtml"]:
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if 'asp-validation-summary="ModelOnly"' in content:
                content = content.replace('asp-validation-summary="ModelOnly"', 'asp-validation-summary="All"')
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)

print("Validation summary updated.")
