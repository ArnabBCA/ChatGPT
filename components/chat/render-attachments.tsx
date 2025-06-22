export const renderAttachments = (attachments: any[]) => {
  return (
    attachments &&
    attachments?.length > 0 && (
      <div className="mt-2 space-y-1">
        {attachments.map((file) => (
          <a
            key={file.url}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline block"
          >
            {file.name || file.url}
          </a>
        ))}
      </div>
    )
  );
};
