import os

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\asp-net-main\asp-net-main\CMS.Backend"
controllers_dir = os.path.join(base_dir, "Controllers")
views_dir = os.path.join(base_dir, "Views")

entities = ["Product", "Post"]

for entity in entities:
    # 1. Update Controller
    controller_path = os.path.join(controllers_dir, f"{entity}Controller.cs")
    with open(controller_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add IWebHostEnvironment
    if "IWebHostEnvironment _webHostEnvironment" not in content:
        content = content.replace("using Microsoft.AspNetCore.Mvc;", "using Microsoft.AspNetCore.Mvc;\nusing Microsoft.AspNetCore.Hosting;\nusing Microsoft.AspNetCore.Http;\nusing System.IO;")
        content = content.replace(f"private readonly ApplicationDbContext _context;", f"private readonly ApplicationDbContext _context;\n        private readonly IWebHostEnvironment _webHostEnvironment;")
        content = content.replace(f"public {entity}Controller(ApplicationDbContext context)", f"public {entity}Controller(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)")
        content = content.replace(f"_context = context;", f"_context = context;\n            _webHostEnvironment = webHostEnvironment;")

    # Update Create POST
    if "IFormFile? imageFile" not in content.split(f"public IActionResult Create({entity} model)")[0] and f"public IActionResult Create({entity} model)" in content:
        create_logic = f"""public async Task<IActionResult> Create({entity} model, IFormFile? imageFile)
        {{
            ModelState.Remove("Category{entity if entity == 'Product' else ''}");
            if (ModelState.IsValid)
            {{
                if (imageFile != null && imageFile.Length > 0)
                {{
                    var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {{
                        await imageFile.CopyToAsync(fileStream);
                    }}
                    model.ImageUrl = "/images/" + uniqueFileName;
                }}
                
                _context.{entity}s.Add(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }}
            """
        content = content.replace(f"public IActionResult Create({entity} model)\n        {{\n            ModelState.Remove(\"Category{'Product' if entity == 'Product' else ''}\");\n            if (ModelState.IsValid)\n            {{\n                _context.{entity}s.Add(model);\n                _context.SaveChanges();\n                return RedirectToAction(nameof(Index));\n            }}", create_logic)

    # Update Edit POST
    if f"public IActionResult Edit(int id, {entity} model)" in content:
        edit_logic = f"""public async Task<IActionResult> Edit(int id, {entity} model, IFormFile? imageFile)
        {{
            if (id != model.Id) return NotFound();

            ModelState.Remove("Category{'Product' if entity == 'Product' else ''}");
            if (ModelState.IsValid)
            {{
                if (imageFile != null && imageFile.Length > 0)
                {{
                    var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images");
                    Directory.CreateDirectory(uploadsFolder);
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {{
                        await imageFile.CopyToAsync(fileStream);
                    }}
                    model.ImageUrl = "/images/" + uniqueFileName;
                }}

                _context.{entity}s.Update(model);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }}"""
        content = content.replace(f"public IActionResult Edit(int id, {entity} model)\n        {{\n            if (id != model.Id) return NotFound();\n\n            ModelState.Remove(\"Category{'Product' if entity == 'Product' else ''}\");\n            if (ModelState.IsValid)\n            {{\n                _context.{entity}s.Update(model);\n                _context.SaveChanges();\n                return RedirectToAction(nameof(Index));\n            }}", edit_logic)

    with open(controller_path, "w", encoding="utf-8") as f:
        f.write(content)

    # 2. Update Create View
    create_view_path = os.path.join(views_dir, entity, "Create.cshtml")
    with open(create_view_path, "r", encoding="utf-8") as f:
        create_view = f.read()

    create_view = create_view.replace('asp-action="Create"', 'asp-action="Create" enctype="multipart/form-data"')
    
    old_input = '<input asp-for="ImageUrl" class="form-control" type="text" />'
    new_input = """<input type="file" name="imageFile" class="form-control" accept="image/*" />
                <span class="text-muted small">Chọn ảnh từ máy tính của bạn</span>"""
    create_view = create_view.replace(old_input, new_input)
    
    with open(create_view_path, "w", encoding="utf-8") as f:
        f.write(create_view)

    # 3. Update Edit View
    edit_view_path = os.path.join(views_dir, entity, "Edit.cshtml")
    with open(edit_view_path, "r", encoding="utf-8") as f:
        edit_view = f.read()

    edit_view = edit_view.replace('asp-action="Edit"', 'asp-action="Edit" enctype="multipart/form-data"')
    
    old_input_edit = '<input asp-for="ImageUrl" class="form-control" type="text" />'
    new_input_edit = """<input type="hidden" asp-for="ImageUrl" />
                <input type="file" name="imageFile" class="form-control" accept="image/*" />
                <div class="mt-2">
                    <small class="text-muted">Ảnh hiện tại:</small><br/>
                    @if (!string.IsNullOrEmpty(Model.ImageUrl)) {
                        <img src="@Model.ImageUrl" style="height: 100px; border-radius: 8px; margin-top: 5px;" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';" />
                    } else {
                        <span class="text-muted small">Chưa có ảnh</span>
                    }
                </div>"""
    edit_view = edit_view.replace(old_input_edit, new_input_edit)

    with open(edit_view_path, "w", encoding="utf-8") as f:
        f.write(edit_view)

print("File upload setup completed successfully.")
