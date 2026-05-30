export const DealsChatMessage = () => (
  <div className="flex items-center gap-4 cursor-pointer">
    <div className="relative size-16">
      <img
        src="https://via.placeholder.com/64"
        className="rounded-xl size-12"
      />
      <img
        src="https://github.com/shadcn.png"
        className="absolute -bottom-1 -right-1 size-8 rounded-full border-2 border-white"
      />
    </div>

    <div className="grow border-b border-neutral-100 pb-4">
      <div className="flex justify-between">
        <span className="font-semibold">Marcos Roberto</span>
        <span className="text-sm text-neutral-500">13:18</span>
      </div>
      <p className="font-medium text-neutral-900">Trade confirmed</p>
      <p className="text-sm text-neutral-600">
        ● Confirmed · Jun 12 - 14 · São Paulo
      </p>
    </div>
  </div>

  //   <div className="space-y-6">
  //     <p className="text-neutral-500">Lista de negociações e trocas...</p>
  //   </div>
);

export default DealsChatMessage;
