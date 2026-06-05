import os

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

    # Add Details action if not exists
    if "public IActionResult Details(" not in content:
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
        # Insert before Edit
        content = content.replace("public IActionResult Edit(", details_action + "\n        public IActionResult Edit(")

    # Fix Create ModelState
    if "if (ModelState.IsValid)" in content:
        clear_model_state = ""
        for nav in entity["navs"]:
            clear_model_state += f'ModelState.Remove("{nav}");\n            '
        if clear_model_state:
            # Replace all occurrences of if (ModelState.IsValid)
            # Need to be careful because we only want to add it right before it.
            # Using a simple string replace for the specific block.
            content = content.replace("public IActionResult Create(" + name + " model)\n        {\n            if (ModelState.IsValid)", 
                                      "public IActionResult Create(" + name + " model)\n        {\n            " + clear_model_state + "if (ModelState.IsValid)")
            content = content.replace("public IActionResult Edit(int id, " + name + " model)\n        {\n            if (id != model.Id) return NotFound();\n\n            if (ModelState.IsValid)", 
                                      "public IActionResult Edit(int id, " + name + " model)\n        {\n            if (id != model.Id) return NotFound();\n\n            " + clear_model_state + "if (ModelState.IsValid)")

    # Fix Delete to handle exceptions
    old_delete = f"""
        public IActionResult Delete(int id)
        {{
            var model = _context.{dbset}.Find(id);
            if (model == null) return NotFound();
            
            _context.{dbset}.Remove(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }}"""
    
    new_delete = f"""
        [HttpPost, ActionName("Delete")]
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
    if "public IActionResult Delete(" in content and "DeleteConfirmed" not in content:
        content = content.replace(old_delete, new_delete)
        # Handle case where white space is slightly different
        import re
        content = re.sub(r'public IActionResult Delete\(int id\)\s*\{\s*var model = _context\.' + dbset + r'\.Find\(id\);\s*if \(model == null\) return NotFound\(\);\s*_context\.' + dbset + r'\.Remove\(model\);\s*_context\.SaveChanges\(\);\s*return RedirectToAction\(nameof\(Index\)\);\s*\}', new_delete, content)

    with open(ctrl_path, 'w', encoding='utf-8') as f:
        f.write(content)

def generate_details_view(entity):
    name = entity["name"]
    view_dir = os.path.join(views_dir, name)
    details_path = os.path.join(view_dir, "Details.cshtml")
    
    fields = ""
    for prop, _ in entity["props"]:
        fields += f"""
                <dt class="col-sm-3">@Html.DisplayNameFor(model => model.{prop})</dt>
                <dd class="col-sm-9">@Html.DisplayFor(model => model.{prop})</dd>"""
                
    for fk in entity["fk"]:
        nav_prop = fk["prop"].replace("Id", "")
        fields += f"""
                <dt class="col-sm-3">{nav_prop}</dt>
                <dd class="col-sm-9">@Html.DisplayFor(model => model.{nav_prop}.{fk['display']})</dd>"""
            
    code = f"""@model CMS.Data.Entities.{name}
@{{
    ViewData["Title"] = "Chi tiết {name}";
}}

<div class="container mt-5">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-info text-white">
            <h3 class="mb-0"><i class="fas fa-info-circle me-2"></i>Chi tiết {name}</h3>
        </div>
        <div class="card-body">
            <dl class="row">
                {fields}
            </dl>
            <div class="mt-4">
                <a asp-action="Edit" asp-route-id="@Model?.Id" class="btn btn-warning"><i class="fas fa-edit me-1"></i>Sửa</a>
                <a asp-action="Index" class="btn btn-secondary"><i class="fas fa-arrow-left me-1"></i>Quay lại</a>
            </div>
        </div>
    </div>
</div>
"""
    with open(details_path, 'w', encoding='utf-8') as f:
        f.write(code)

def update_index_view_add_details_btn(entity):
    name = entity["name"]
    index_path = os.path.join(views_dir, name, "Index.cshtml")
    
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Add Details button next to Edit
        if "asp-action=\"Edit\"" in content and "asp-action=\"Details\"" not in content:
            # We look for the Edit button and prepend the Details button
            edit_pattern1 = f'<a asp-action="Edit" asp-route-id="@item.Id" class="btn btn-warning'
            details_btn1 = f'<a asp-action="Details" asp-route-id="@item.Id" class="btn btn-info w-50 rounded-pill text-white"><i class="bi bi-info-circle me-1"></i>Xem</a>\n                                '
            
            edit_pattern2 = f'<a asp-action="Edit" asp-route-id="@item.Id" class="btn btn-outline-warning'
            details_btn2 = f'<a asp-action="Details" asp-route-id="@item.Id" class="btn btn-outline-info btn-sm border-0"><i class="fas fa-eye"></i></a>\n                                        '
            
            edit_pattern3 = f'<a asp-action="Edit" asp-route-id="@user.Id" class="btn btn-action btn-edit me-1'
            details_btn3 = f'<a asp-action="Details" asp-route-id="@user.Id" class="btn btn-action btn-info me-1 d-inline-flex justify-content-center align-items-center text-decoration-none text-white" title="Xem"><i class="fas fa-eye"></i></a>\n                                    '

            if edit_pattern1 in content:
                content = content.replace(edit_pattern1, details_btn1 + edit_pattern1)
            elif edit_pattern2 in content:
                content = content.replace(edit_pattern2, details_btn2 + edit_pattern2)
            elif edit_pattern3 in content:
                content = content.replace(edit_pattern3, details_btn3 + edit_pattern3)
                
            # Also inject TempData ErrorMessage display at the top of container mt-5
            err_msg = """
    @if (TempData["ErrorMessage"] != null)
    {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            @TempData["ErrorMessage"]
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    }"""
            if "class=\"container mt-5\">" in content and "TempData[\"ErrorMessage\"]" not in content:
                content = content.replace('class="container mt-5">', 'class="container mt-5">' + err_msg)
                
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(content)

print("Starting fix...")
for e in entities:
    update_controller(e)
    generate_details_view(e)
    update_index_view_add_details_btn(e)
print("Fix complete.")
