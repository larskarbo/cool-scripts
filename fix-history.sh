#!/bin/zsh

# Set your custom string here
custom_string="i"

# The name of your input file
input_file=/Users/lars/.zsh_history
echo "Fixing history file: $input_file"
# Use sed to find and replace all instances of the specified strings
sed -i "s/npm i/$custom_string/g" $input_file
sed -i "s/npm install/$custom_string/g" $input_file
sed -i "s/pnpm i/$custom_string/g" $input_file
sed -i "s/pnpm install/$custom_string/g" $input_file
sed -i "s/yarn add/$custom_string/g" $input_file
