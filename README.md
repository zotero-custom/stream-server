## Contributing

1. Clone the repo
   ```sh
   git clone https://github.com/zotero-custom/stream-server.git
   ```
2. Create new branch for your changes
   ```sh
   cd stream-server
   git checkout -b foo
   ```
3. Make your changes 
4. Commit your changes and push your local branch.
   Create a PR in the repo for your branch.
5. Merge the PR. 
   The CI/CD pipeline will take care of building the images.
6. After merging completes successfully,
   create a new tag and push it.
   ```sh
   git checkout master
   # Run `git tag` and increment to next version
   git tag -a vX.Y.Z -m "Your release message"
   git push origin vX.Y.Z
   ```
   
The CI/CD pipeline should then create the release automatically after pushing the tag.
You should then be able to pull the image from anywhere:

```sh
docker pull ghcr.io/zotero-custom/stream-server:latest
```