with open(r"d:\ACET CAMRI\server\scripts\seedDemoProducts.js", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("import { store }", "import store")
with open(r"d:\ACET CAMRI\server\scripts\seedDemoProducts.js", "w", encoding="utf-8") as f:
    f.write(content)
