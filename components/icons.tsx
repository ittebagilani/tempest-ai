import { LucideProps, Tornado, User } from 'lucide-react'

export const Icons = {
  user: User,
  logo: (props: LucideProps) => (
    <Tornado {...props} />
  ),
}