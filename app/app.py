import webview

window = webview.create_window(
    'Mi App',
    'http://localhost:3000/',
    text_select=True,
    draggable=False
)
webview.start()