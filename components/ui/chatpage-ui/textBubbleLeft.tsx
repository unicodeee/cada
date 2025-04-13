import {Card, CardContent} from "@components/ui/card";
import React from "react";
import {cn} from "@lib/utils";

const TextBubbleLeft = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
    return (
        <div className="flex flex-col items-start">
            <Card
                ref={ref}
                className={cn("bg-gray-200 text-black rounded-2xl p-3 max-w-xs mt-2", className)}
                {...props}
            >
                <CardContent  {...props}></CardContent>
            </Card>
        </div>
    );
})
TextBubbleLeft.displayName = "TextBubbleLeft"

export {TextBubbleLeft}