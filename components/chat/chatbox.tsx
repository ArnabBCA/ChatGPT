
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import SlidersIcon from "../icons/sliders-icon";
import PlusIcon from "../icons/plus-icon";
import MicIcon from "../icons/mic-icon";
import VoiceIcon from "../icons/voice-icon";

export default function Chatbox() {
  return (
    <div className="flex w-full flex-col max-w-[32rem] sm:max-w-[40rem] md:max-w-[48rem] items-center mb-4">
      <h1 className="text-2xl leading-9 font-semibold mb-7 text-page-header min-h-10.5 min-[510px]:mt-[25dvh] max-[768px]:mt-[25dvh] lg:mt-[calc(30dvh+25px)]">
        What are you working on?
      </h1>
      <div className="w-full rounded-[28px] overflow-hidden p-2.5 dark:bg-[#303030] shadow-short">
        <Textarea
          className="w-full border-none focus-visible:border-none focus-visible:ring-0 shadow-none !bg-transparent pb-0 pt-[7px] px-3 pl-[11px]  min-h-12 !text-[16px] font-normal hide-resizer placeholder:font-normal"
          placeholder="Ask anything"
        />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-[1px]">
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal"
              variant={"ghost"}
              size={"icon"}
            >
              <PlusIcon size={20} />
            </Button>
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal flex items-center gap-1.5 !px-2"
              variant={"ghost"}
            >
              <SlidersIcon size={20} />
              <span className="pb-[1px]">Tools</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-100/50 dark:hover:!bg-neutral-700 rounded-full font-normal size-8"
              variant={"ghost"}
              size={"icon"}
            >
              <MicIcon size={20} />
            </Button>
            <Button
              className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200 dark:hover:!bg-neutral-500/80 rounded-full font-normal bg-[#00000014] dark:bg-[#ffffff29]"
              variant={"ghost"}
              size={"icon"}
            >
              <VoiceIcon size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
