import { fetchProjects } from "@/backend/lib/apii";
import ProjectsAdminPage from "@/components/admin/projects/projects";

const Projects = async () => {
  const projects = await fetchProjects();

  // console.log(projects);
  return <ProjectsAdminPage projects={projects?.projects} />;
};
export default Projects;
