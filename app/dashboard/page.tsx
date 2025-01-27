import { useSidebarContext } from "@/app/context/SidebarContext";
import { AppSidebar } from "@/components/app-sidebar"
import { Details } from "@/components/details/details";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const { selectedItem, selectedCategory } = useSidebarContext();


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Inicio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                {selectedCategory && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selectedCategory}</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                {selectedItem && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{selectedItem}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {selectedItem ? < Details/> :
        <div className="flex flex-1 flex-col gap-10 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
            <div className="aspect-video rounded-xl bg-muted" />
          </div>
          <div className="grid auto-rows-min gap-5 md:grid-cols-5">
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
            <div className="aspect-[2/3] rounded-xl bg-muted" />
          </div>
        </div>
        }
      </SidebarInset>
    </SidebarProvider>
  )
}
