export default function Composer(): React.ReactNode {
  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Type your message..." className="border border-gray-300 rounded-md p-2" />
      <button className="bg-blue-500 text-white rounded-md p-2">Send</button>
    </div>
  );
}
