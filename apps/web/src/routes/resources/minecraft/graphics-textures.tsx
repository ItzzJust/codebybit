import { createFileRoute } from "@tanstack/react-router";

import { ResourceList } from "@/components/minecraft/resource-list";

function RouteComponent() {
  return <ResourceList />;
}

export const Route = createFileRoute("/resources/minecraft/graphics-textures")({
  component: RouteComponent,
});
