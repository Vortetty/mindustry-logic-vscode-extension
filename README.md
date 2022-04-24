# Mindustry Logic

Mindustry logic highlighting + C to MLOG compiler

## Features

### Highlighting

Highlights MLOG in the editor.

Semantic highlighting __must__ be enabled, it enables this for the language by default so you'd have to go out of your way to disable it but it does need enabled for this to work.

### Compilation

Compiles C to MLOG using a modified version of [c2logic](https://github.com/SuperStormer/c2logic)

## Requirements

- Python 3.8+ (does not support windows py launcher as of now)
- pycparser (`pip install pycparser` or `pip3 install pycparser`)

## Known Issues

Highlighting doesn't work in unsaved files unless they were created before the extension started with some themes, highlighting *should* work in saved files.

There are a few workarounds:

- Try other themes
- Select a different theme then go back to your preferred every time
- add `"semanticHighlighting": true` to the theme's json file if you know how, this could violate the theme's license so do at your own risk

Ultimately this issue is vscode's fault since even with the language-specific setting enabled there are issues, but there isn't really a way to fix it until one of the following happens:

- they fix it
- `"semanticHighlighting": true` is the default
- or theme creators start adding `"semanticHighlighting": true` to their themes

## License

Apache 2.0 (see `LICENSE` for details)
