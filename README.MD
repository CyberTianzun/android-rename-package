# Android-Rename

## Introduction

   [中文版本](http://hiroz.cn/android-rename-package-readme/)

   This is a CLI tools for renaming android app package name with code.

## Installation

### NPM

   Android-Rename-Package is based on nodejs. You may install node.js before use it. Then install this tools.

   ```
   npm -g install android-rename
   ```

### Git

   You can download this repo, and use npm local install.

   ```
   git clone https://github.com/cnzx219/android-rename-package.git
   cd android-rename-package
   npm -g install
   ```

## Usage

   Open your terminal, type the following command:

   ```
   rp r <projectDir> --package-name <newPackageName>
   ```

   For example, 

   ```
   cd /Users/hiro/Documents/workspaces
   rp r qihoapptore --package-name cn.hiroz.appstore --with-providers --with-actions --with-processes
   ```

## Help

   You can use the following cmmand to get more help:

   ```
   rp r --help
   ```

   Including all the options arguments:

   ```
   -h, --help                 output usage information
   -p, --package-name <name>  set new package name
   --with-providers           modify provider authorities. default is false
   --with-actions             modify action name. default is false
   --with-processes           modify services, provider, receiver process name. default is false
   --prjtype <type>           is either a eclipse project or android studio project
   --main-project <dir>       set main project, when hava many library.
   -P, --policy <jsconfig>    Custom rename policy via javascript file.
   ```

## Custom

   This tool support the custom policy. Document is comming soon.

## Copyrights

   The MIT License (MIT)

   Copyright (c) 2015 Hiro (hiroz.cn)

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.