import { fetchExperiences } from "@/backend/lib/apii";
import ExperienceAdminPage from "@/components/admin/experience/experience";

const ExperiencePage = async () => {
  const experience = await fetchExperiences();

  console.log(experience);
  return <ExperienceAdminPage exps={experience?.experiences} />;
};

export default ExperiencePage;
