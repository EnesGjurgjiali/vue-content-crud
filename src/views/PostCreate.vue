<script setup>
import { reactive, computed, onMounted, watch } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useRouter, useRoute } from 'vue-router'
import MyWrapper from '@/components/MyWrapper.vue'

const router = useRouter()
const postsStore = usePostsStore()
const route = useRoute()

const post = reactive({
  title: '',
  body: '',
})

const isFormValid = computed(() => {
  return post.title === '' || post.body === ''
})

const isEdit = computed(() => !!route.params.id)

onMounted(() => {
  if (isEdit.value) {
    const existing = postsStore.posts.find((p) => p.id == route.params.id)
    if (existing) {
      post.title = existing.title
      post.body = existing.body
    } else {
      postsStore.getPosts()
    }
  }
})

watch(
  () => postsStore.posts,
  (newPosts) => {
    if (isEdit.value) {
      const existing = newPosts.find((p) => p.id == route.params.id)
      if (existing) {
        post.title = existing.title
        post.body = existing.body
      }
    }
  },
)

const submit = () => {
  if (isEdit.value) {
    postsStore.updatePost(route.params.id, { title: post.title, body: post.body })
  } else {
    postsStore.addPost(post)
  }
  router.push({ name: 'home' })
}
</script>

<template>
  <MyWrapper>
    <form @submit.prevent="submit">
      <h3>{{ isEdit ? 'Edit post' : 'Create a new post' }}</h3>
      <div>
        <label>Post Title</label>
        <input type="text" v-model="post.title" />
      </div>
      <div>
        <label>Post Body</label>
        <textarea rows="7" v-model="post.body"></textarea>
      </div>
      <div>
        <button :disabled="isFormValid">{{ isEdit ? 'Update' : 'Add' }}</button>
      </div>
    </form>
  </MyWrapper>
</template>

<style lang="scss" scoped>
form {
  padding: 2rem;
}
h3 {
  margin-bottom: 2rem;
}
div {
  margin-bottom: 1rem;
  label {
    font-weight: 300;
  }
  input,
  textarea {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    border: 1px solid #333;
    padding: 5px;
    border-radius: 5px;
    &:focus {
      outline: 2px solid #3b82f6;
      border: none;
    }
  }
  button {
    background: #3b82f6;
    color: #fff;
    width: 100%;
    padding: 5px;
    border-radius: 5px;
    &:hover {
      background: #2563eb;
    }
    &:disabled {
      background: #eee;
      cursor: not-allowed;
    }
  }
}
</style>
