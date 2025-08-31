import { Card, CardBody, CardHeader, CardProps } from "@nextui-org/react";
import React from "react";

export default function EmptyState({
  customText,
  customBodyText,
}: {
  customText: string;
  customBodyText?: string;
}) {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="shadow-lg">
        <CardHeader className="text-3xl text-secondary px-4">
          {customText}
        </CardHeader>
        {customBodyText && (
          <CardBody className="text-center mb-2">{customBodyText}</CardBody>
        )}
      </Card>
    </div>
  );
}
