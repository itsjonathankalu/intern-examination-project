import { MessageList } from '@/components/message-list';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <MessageList />
      </div>
    </main>
  );
}