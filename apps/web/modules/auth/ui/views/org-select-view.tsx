import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectionView = () => {
    return(
        <OrganizationList hidePersonal  afterCreateOrganizationUrl="/" afterSelectOrganizationUrl="/"/>
    )
}