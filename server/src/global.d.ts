interface UserInfo {
  idx?: number
  userId: string
  password: string
  name?: string
  nickname?: string
  regdate?: string
}

interface Post {
  idx?: number
  userIdx?: number
  nickname?: string
  title: string
  content: string
  regdate?: string
}