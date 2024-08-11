import { z } from 'zod';

export const TransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, {
    message: '日付は必須です',
  }),
  amount: z.number().min(1, {
    message: '金額は1円以上で入力してください',
  }),
  content: z
    .string()
    .min(1, {
      message: '内容は必須です',
    })
    .max(50, {
      message: '内容は50文字以下で入力してください',
    }),
  category: z
    .union([
      z.enum(['食費', '日用品', '住居費', '交際費', '娯楽']),
      z.enum(['給与', '副収入', 'お小遣い']),
      z.literal(''),
    ])
    .refine((val) => val !== '', {
      message: 'カテゴリは必須です',
    }),
});

export type Schema = z.infer<typeof TransactionSchema>;
