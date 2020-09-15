cd ~/Downloads
FILENAME=$(ls -Art | grep pdf | grep -v comp | tail -n 1)
echo $FILENAME



### OLD:
# convert -density 150 "$FILENAME" -quality 90 "$FILENAME.png"


## nb det her er kanskje bedre: https://askubuntu.com/questions/50170/how-to-convert-pdf-to-image/50180#50180

### NEW:
pdftoppm "$FILENAME" "$FILENAME" -png -r 300