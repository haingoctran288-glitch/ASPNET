import os
import re

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\asp-net-main\asp-net-main\CMS.Backend"
controllers_dir = os.path.join(base_dir, "Controllers")
views_dir = os.path.join(base_dir, "Views")

entities = [
    {
        "name": "Category",
        "dbset": "Categories",
        "props": [("Name", "string"), ("Description", "string")],
        "fk": [],
        "navs": ["Post"]
    },
    {
        "name": "CategoryProduct",
        "dbset": "CategoriesProducts",
        "props": [("Name", "string"), ("Description", "string")],
        "fk": [],
        "navs": ["Products"]
    },
    {
        "name": "Customer",
        "dbset": "Customers",
        "props": [("FullName", "string"), ("Email", "string"), ("Phone", "string"), ("Address", "string"), ("Password", "string")],
        "fk": [],
        "navs": ["Orders"]
    },
    {
        "name": "Order",
        "dbset": "Orders",
        "props": [("OrderDate", "datetime"), ("Status", "int"), ("Notes", "string")],
        "fk": [{"prop": "CustomerId", "nav": "Customers", "display": "FullName"}],
        "navs": ["Customer", "OrderDetails"]
    },
    {
        "name": "OrderDetail",
        "dbset": "OrderDetails",
        "props": [("Quantity", "int"), ("UnitPrice", "decimal")],
        "fk": [{"prop": "OrderId", "nav": "Orders", "display": "Id"}, {"prop": "ProductId", "nav": "Products", "display": "Name"}],
        "navs": ["Order", "Product"]
    },
    {
        "name": "Post",
        "dbset": "Posts",
        "props": [("Title", "string"), ("Content", "string"), ("ImageUrl", "string"), ("CreatedDate", "datetime")],
        "fk": [{"prop": "CategoryId", "nav": "Categories", "display": "Name"}],
        "navs": ["Category"]
    },
    {
        "name": "Product",
        "dbset": "Products",
        "props": [("Name", "string"), ("Description", "string"), ("Price", "decimal"), ("StockQuantity", "int"), ("ImageUrl", "string")],
        "fk": [{"prop": "CategoryProductId", "nav": "CategoriesProducts", "display": "Name"}],
        "navs": ["CategoryProduct"]
    },
    {
        "name": "User",
        "dbset": "Users",
        "props": [("Username", "string"), ("PasswordHash", "string"), ("FullName", "string"), ("Role", "string")],
        "fk": [],
        "navs": []
    }
]

def update_controller(entity):
    name = entity["name"]
    dbset = entity["dbset"]
    ctrl_path = os.path.join(controllers_dir, f"{name}Controller.cs")
    
    with open(ctrl_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Details action
    include_str = ""
    for fk in entity["fk"]:
        nav_prop = fk["prop"].replace("Id", "")
        include_str += f".Include(x => x.{nav_prop})"
        
    details_action = f"""
        public IActionResult Details(int id)
        {{
            var model = _context.{dbset}{include_str}.FirstOrDefault(m => m.Id == id);
            if (model == null) return NotFound();
            return View(model);
        }}
"""
    # Replace ONLY the FIRST occurrence of "public IActionResult Edit("
    if "public IActionResult Details(" not in content:
        content = content.replace("public IActionResult Edit(int id)", details_action + "        public IActionResult Edit(int id)", 1)

    # 2. Fix Create and Edit ModelState validation
    clear_model_state = ""
    for nav in entity["navs"]:
        clear_model_state += f'ModelState.Remove("{nav}");\n            '
        
    if clear_model_state:
        # For Create
        create_pattern = f"public IActionResult Create({name} model)\n        {{\n            if (ModelState.IsValid)"
        create_replacement = f"public IActionResult Create({name} model)\n        {{\n            {clear_model_state}if (ModelState.IsValid)"
        content = content.replace(create_pattern, create_replacement)
        
        # For Edit
        edit_pattern = f"public IActionResult Edit(int id, {name} model)\n        {{\n            if (id != model.Id) return NotFound();\n\n            if (ModelState.IsValid)"
        edit_replacement = f"public IActionResult Edit(int id, {name} model)\n        {{\n            if (id != model.Id) return NotFound();\n\n            {clear_model_state}if (ModelState.IsValid)"
        content = content.replace(edit_pattern, edit_replacement)

    # 3. Fix Delete Exception Handling
    old_delete_pattern = re.compile(
        r'public IActionResult Delete\(int id\)\s*\{\s*var model = _context\.' + dbset + r'\.Find\(id\);\s*if \(model == null\) return NotFound\(\);\s*_context\.' + dbset + r'\.Remove\(model\);\s*_context\.SaveChanges\(\);\s*return RedirectToAction\(nameof\(Index\)\);\s*\}'
    )
    new_delete = f"""[HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {{
            var model = _context.{dbset}.Find(id);
            if (model == null) return NotFound();
            
            try
            {{
                _context.{dbset}.Remove(model);
                _context.SaveChanges();
            }}
            catch (DbUpdateException)
            {{
                TempData["ErrorMessage"] = "Không thể xóa vì dữ liệu này đang được liên kết với dữ liệu khác.";
                return RedirectToAction(nameof(Index));
            }}
            return RedirectToAction(nameof(Index));
        }}"""
    
    if "DeleteConfirmed" not in content:
        content = old_delete_pattern.sub(new_delete, content)

    with open(ctrl_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Starting fix...")
for e in entities:
    update_controller(e)
print("Fix complete.")
