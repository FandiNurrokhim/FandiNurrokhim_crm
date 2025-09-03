import Heading from "@/Components/Atoms/Portfolio/Education/Heading";
import Divider from "@/Components/Atoms/Portfolio/Education/Divider";
import EducationItem from "@/Components/Molecules/Portfolio/Education/EducationItem";
import { Fade } from "react-awesome-reveal";

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Heading size="4xl" className="mb-4">Education</Heading>
          <Divider />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Fade direction="up" triggerOnce>
            <div>
              <Heading size="2xl" className="mb-6">Formal Education</Heading>
              <Fade direction="left" triggerOnce>
                <EducationItem
                  title="Bachelor of Computer Science"
                  institution="University of Technology"
                  date="2015 - 2019 | GPA: 3.8/4.0"
                  description="Specialized in Software Engineering and Web Development"
                  icon="graduation-cap"
                  bgColor="bg-blue-100 dark:bg-blue-900"
                  iconColor="text-blue-600"
                />
              </Fade>
            </div>
          </Fade>

          <Fade direction="right" triggerOnce>
            <div>
              <Heading size="2xl" className="mb-6">Certifications & Courses</Heading>
              <div className="space-y-6">
                <Fade direction="up" triggerOnce>
                  <EducationItem
                    title="AWS Certified Developer"
                    institution="Amazon Web Services"
                    date="2023"
                    icon="award"
                    bgColor="bg-green-100 dark:bg-green-900"
                    iconColor="text-green-600"
                  />
                </Fade>
                <Fade direction="left" triggerOnce>
                  <EducationItem
                    title="React Advanced Certification"
                    institution="Meta"
                    date="2022"
                    icon="award"
                    bgColor="bg-purple-100 dark:bg-purple-900"
                    iconColor="text-purple-600"
                  />
                </Fade>
                <Fade direction="right" triggerOnce>
                  <EducationItem
                    title="Full Stack Web Development"
                    institution="freeCodeCamp"
                    date="2021"
                    icon="award"
                    bgColor="bg-yellow-100 dark:bg-yellow-900"
                    iconColor="text-yellow-600"
                  />
                </Fade>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};