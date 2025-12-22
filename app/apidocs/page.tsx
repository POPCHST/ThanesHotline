"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./swagger-light.css";

export default function ApiDocsPage() {
  return <SwaggerUI url="/api/swagger" />;
}
