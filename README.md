# CardMaker

The greatest website to ever and will ever and should ever and could ever exist...

### Djas Directives:
- Make sure prettier is installed as a VSCode extension.
- Go into VSCode settings and search for 'format on save'. Set it to true. Everytime you save a file, the file should be formatted according to the prettier config in your package.json file.
- Remove the node_modules folder, then run **npm install**. I just got rid of the unecessary testing packages.
- Do a CTRL-SHIFT-F and search for djas. I've made a few changes and in all of these places, I've left a comment that starts with djas that describes what I did. You can remove these comments if you'd like after you've read them.
- Sorry I didn't get to look to in depth at the card maker stuff. I just did some general changes. Let me know if there's anything I should do differently and next time I will focus on the card maker stuff. You can also look at the git commit history and view the most recent commit to see all of my changes. Thanks boht! :D

### Djas Suggestions:
- public folder: I suggest that you stick to a consitent naming convention like camelCase for all assets and subfolders.
- I suggest including **component** in your component file names and class names. Like app.component.html, app.component.ts, app.component.scss. And have the component be called AppComponent instead of App. I think it just helps to group together files of the same component in this way.
- I think you should use kebab case (🍢) for all of your css class names. Instead of **cardContainer**, use **card-container**. I think doing so makes it easier to distinguish class names from your variables which are using camelCase.
