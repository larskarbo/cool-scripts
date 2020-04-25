for D in `find ~/dev -mindepth 1 -type d -maxdepth 1`
do
    # cd $D
    echo $D
    # echo $(pwd)
    # git archive -o ~/slett/$(basename $D).zip HEAD
done