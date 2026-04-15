
import React from 'react';
import { useContent } from '../ContentContext';
import type { TeamMember } from '../types';

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 text-center flex flex-col items-center h-full">
      <div className="flex-shrink-0 h-32 w-32 mb-5 overflow-hidden rounded-full bg-pdi-red/10 flex items-center justify-center">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('');
              e.currentTarget.parentElement!.innerHTML = `<span class="text-pdi-red font-bold text-2xl">${initials}</span>`;
            }}
          />
        ) : (
          <span className="text-pdi-red font-bold text-2xl">
            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-pdi-dark-blue">{member.name}</h3>
      <p className="text-md text-pdi-gray mt-1 whitespace-pre-line">{member.role}</p>
    </div>
  );
};

const TeamSection: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="team" className="py-20 bg-pdi-light-gray scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-pdi-dark-blue">
            {content.teamTitle}
          </h2>
          <p className="mt-4 text-lg text-pdi-gray max-w-2xl mx-auto whitespace-pre-line">
            {content.teamSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.team.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
