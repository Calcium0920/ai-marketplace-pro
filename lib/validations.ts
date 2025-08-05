import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

export const signupSchema = z.object({
  name: z.string().min(2, '名前は2文字以上で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
})

export const productSchema = z.object({
  title: z.string().min(5, 'タイトルは5文字以上で入力してください'),
  description: z.string().min(50, '説明は50文字以上で入力してください'),
  price: z.number().min(100, '価格は100円以上で設定してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  tags: z.array(z.string()).min(1, '最低1つのタグを追加してください'),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'コメントは10文字以上で入力してください'),
})