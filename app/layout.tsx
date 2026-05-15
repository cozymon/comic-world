import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '일본 인기만화 트렌드',
  description: '한국어 제목으로 보는 일본 만화 트렌드 대시보드'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
