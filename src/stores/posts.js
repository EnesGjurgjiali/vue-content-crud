import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts-store', {
  state() {
    return {
      posts: [],
      loading: true,
      errMsg: '',
    }
  },

  //computed
  getters: {
    sorted() {
      return this.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    saved() {
      return this.posts
        .filter((post) => post.is_saved)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
    all() {
      return this.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
  },

  //methods
  actions: {
    getPosts() {
      fetch('http://localhost:3000/posts')
        .then((res) => res.json())
        .then((data) => {
          this.posts = data
          this.loading = false
        })
        .catch((err) => {
          this.errMsg = err.message
          this.loading = false
        })
    },

    addPost(post) {
      const newPost = {
        title: post.title,
        body: post.body,
        author: 'John Doe',
        created_at: new Date().toLocaleString(),
        is_saved: false,
      }
      this.loading = true
      fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })
        .then((res) => res.json())
        .then((savedPost) => {
          this.posts.push(savedPost)
          this.loading = false
        })
        .catch((err) => {
          this.errMsg = err.message
          this.loading = false
        })
    },
    deletePost(id) {
      this.posts = this.posts.filter((post) => post.id !== id)

      fetch(`http://localhost:3000/posts/${id}`, {
        method: 'DELETE',
      }).catch((err) => {
        this.errMsg = err.message
        this.loading = false
      })
    },
    savePost(id) {
      const post = this.posts.find((p) => p.id === id)
      post.is_saved = !post.is_saved

      fetch(`http://localhost:3000/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_saved: post.is_saved }),
      }).catch((err) => {
        this.errMsg = err.message
        this.loading = false
      })
    },
  },
})
