import {get, post} from "jquery";

let API = {

  
  saveBookmark(newBookmark) {
    return post("/graphql", {
      query: `
        mutation {
          createLink(title: "${newBookmark.title}", url: "${newBookmark.url}") {
            id
            title
            url
            safe
          }
        }
      `
    })
  },
  getAllBookmarks() {
    return post("/graphql", {
      query: `
        {
          bookmarks: allLinks {
            id: _id
            title
            url
          }
        }
      `
    })
  }
};

export default API;
