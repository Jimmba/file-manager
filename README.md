# File-manager

### IMPORTANT: If you use spaces in path please enclose the path in double quotes (e.x.: `ls "Program Files/Windows NT"`)

## General

To run the script use `node src/index.js -- --username=YOURNAME`
To exit press enter `.exit` or press `CTRL + C`

## Available options

### Operating system info (prints following information in console)

`os --EOL`- get EOL (default system End-Of-Line)
`os --cpus`- get cpus info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
`os --homedir`- get home directory
`os --username`- get current system user name
`os --architecture`- get CPU architecture for which Node.js binary has compiled

### Hash calculation

`hash path_to_file`- Calculate hash for file.

### Compress and decompress operations

`compress path_to_file path_to_destination` - compress file
`decompress path_to_file path_to_destination` - decompress file

### Navigation & working directory operations implemented properly

`up` - go upper from current directory
`cd path_to_directory` - go to dedicated folder from current directory (you also can use `cd ../path_to_directory`, or `cd d:/path_to_directory`)
`ls` - get list all files and folders in current directory (you also can use `ls ../path_to_directory`, or `ls d:/path_to_directory`)

### Basic operations with files implemented properly

`cat path_to_file` - read file and print it's content in console
`add new_file_name` - create empty file
`rn path_to_file new_filename` - rename file
`cp path_to_file path_to_new_directory` - copy file
`mv path_to_file path_to_new_directory` - move file
`rm path_to_file` - remove file

### Errors handlers

Running commands you may encounter errors. They are handled using two types error handling:
**INVALID INPUT** - errors due to incorrect user input (arguments not passed, arguments passed incorectly, command not found, etc.)
**FS OPERATION ERROR** - errors due to filesystem (file not found, path not file, file already exists, etc.)
