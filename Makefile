.PHONY: deploy
deploy:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		./ \
		garron.net:~/garron.net/app/vidframe/
	echo "\nDone deploying. Go to https://garron.net/app/vidframe/\n"

.PHONY: open
open:
	open "https://garron.net/app/vidframe/"
