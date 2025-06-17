import { Textarea } from "../ui/textarea";

export default function Chatbox() {
  return (
    <div className="flex w-full flex-col max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem]">
      <h1>What are you working on?</h1>
      <div className="w-full">
        <Textarea className="w-full" placeholder="Ask anything" />
        <div></div>
      </div>
    </div>
  );
}
