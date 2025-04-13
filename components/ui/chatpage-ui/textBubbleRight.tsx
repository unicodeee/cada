import {Card, CardContent} from "@components/ui/card";
import React from "react";
import {cn} from "@lib/utils";

const TextBubbleRight = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(( { className, ...props }, ref ) => {
  return (
      <div className="flex flex-col items-end">
          <Card
              ref={ref}
              className={cn("bg-purple-500 text-white rounded-2xl max-w-xs mt-2", className)}
              {...props}
          >
            <CardContent {...props}></CardContent>
          </Card>
      </div>
  );
})
TextBubbleRight.displayName = "TextBubbleRight"

export {TextBubbleRight}