'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout";
import {
  User, MapPin, Globe, Mail, Phone, Calendar, Briefcase, GraduationCap, Star, Plus, Edit3, Save,
  Linkedin, Github, Twitter, Heart, Shield, Eye, EyeOff, Home, PhoneCall, Trophy, Users, CheckCircle
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    bio: 'Full-stack developer passionate about creating innovative web applications. Love working with Node.js, React, and PostgreSQL.',
    date_of_birth: '1990-05-15',
    gender: 'male',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    occupation: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    phone: '+1-555-0123',
    address: '123 Tech Street, San Francisco, CA 94102'
  });

  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe'
  });

  const [experiences, setExperiences] = useState([
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      duration: '2020 - Present',
      description: 'Leading development of scalable web applications using modern technologies.'
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'StartupXYZ',
      duration: '2015 - 2020',
      description: 'Built and maintained multiple web applications.'
    }
  ]);

  const [skills, setSkills] = useState([
    { id: '1', name: 'JavaScript', level: 'expert' },
    { id: '2', name: 'Node.js', level: 'expert' },
    { id: '3', name: 'React', level: 'advanced' },
    { id: '4', name: 'PostgreSQL', level: 'advanced' },
    { id: '5', name: 'AWS', level: 'intermediate' }
  ]);

  const [interests, setInterests] = useState([
    { id: '1', name: 'Web Development' },
    { id: '2', name: 'Open Source' },
    { id: '3', name: 'Machine Learning' },
    { id: '4', name: 'Photography' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: '1', text: 'Led team of 5 developers to deliver project 2 weeks early' },
    { id: '2', text: 'Reduced application load time by 40%' },
    { id: '3', text: 'Mentored 3 junior developers' }
  ]);

  const handleProfileSave = () => {
    updateProfile({
      bio: profile.bio,
      date_of_birth: profile.date_of_birth,
      gender: profile.gender,
      location: profile.location,
      website: profile.website,
      occupation: profile.occupation,
      company: profile.company,
      phone: profile.phone,
      address: profile.address,
      github: socialLinks.github,
      linkedin: socialLinks.linkedin,
      twitter: socialLinks.twitter
    });
    setIsEditing(false);
  };

  const navigationConfig = {
    backgroundColor: "bg-gradient-to-r from-blue-900/50 to-indigo-900/50",
    logoText: "BF",
    content: (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-white">Professional Profile</h1>
          <p className="text-blue-200">Showcase your skills and experience</p>
        </div>
      </div>
    ),
  };

  if (!isAuthenticated) {
    return (
      <Layout navigation={navigationConfig}>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600">Please log in to view your profile</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigationConfig}>
      <div className="min-h-screen bg-gray-50 ">
        <div className="max-w-4xl mx-auto pt-5">

          {/* Profile Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative rounded-t-lg">
              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="bg-white/90 hover:bg-white border-gray-300 text-gray-700"
                >
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Save' : 'Edit Profile'}
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-6 -mt-20 relative">
              <div className="flex items-end space-x-6">
                <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-5xl font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-20 h-20" />}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Your Name'}</h1>
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600 font-medium">He/Him</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <Input
                      value={profile.occupation}
                      onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                      className="text-xl text-gray-900 bg-transparent border-none p-0 mb-2 font-medium"
                      placeholder="Your occupation"
                    />
                  ) : (
                    <p className="text-xl text-gray-900 font-medium mb-2">{profile.occupation}</p>
                  )}

                  {isEditing ? (
                    <Input
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      className="text-lg text-gray-500 bg-transparent border-none p-0 mb-3"
                      placeholder="Company"
                    />
                  ) : (
                    <p className="text-lg text-gray-500 mb-3">{profile.company}</p>
                  )}

                  <div className="flex items-center space-x-6 text-gray-600 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      {isEditing ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="w-32 bg-transparent border-none p-0"
                          placeholder="Location"
                        />
                      ) : (
                        <span>{profile.location}</span>
                      )}
                    </div>

                    {profile.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        {isEditing ? (
                          <Input
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                            className="w-40 bg-transparent border-none p-0"
                            placeholder="Website"
                          />
                        ) : (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profile.website}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* About Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">About</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {isEditing ? (
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-[100px] resize-none"
                        placeholder="Tell people about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Experience Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-500 pl-4 pb-4 last:pb-0">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{exp.title}</h3>
                          <p className="text-blue-600 font-medium text-sm mb-1">{exp.company}</p>
                          <p className="text-gray-500 text-xs">{exp.duration}</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium text-sm">{skill.name}</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Trophy className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">{achievement.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                {/* Personal Information */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 text-xs mb-1">Date of Birth</p>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                            className="bg-gray-50 border-gray-300 text-gray-900 text-sm"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm">{profile.date_of_birth}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 text-xs mb-1">Gender</p>
                        {isEditing ? (
                          <select
                            value={profile.gender}
                            onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value }))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm w-full"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 text-sm capitalize">{profile.gender}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Education Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900 text-sm mb-1">Bachelor of Science in Computer Science</h3>
                      <p className="text-green-600 font-medium text-sm mb-1">Stanford University</p>
                      <p className="text-gray-500 text-xs">2012</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Interests Section */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Interests</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={interest.id} className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1">
                          {interest.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-900 text-sm truncate">{user?.email}</span>
                    </div>

                    {profile.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        {isEditing ? (
                          <Input
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className="flex-1 bg-gray-50 border-gray-300 text-gray-900 text-sm"
                            placeholder="Phone number"
                          />
                        ) : (
                          <span className="text-gray-900 text-sm">{profile.phone}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-gray-900">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Github className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      {isEditing ? (
                        <Input
                          value={socialLinks.github}
                          onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                          className="flex-1 bg-gray-50 border-gray-300 text-gray-900 text-sm"
                          placeholder="GitHub profile URL"
                        />
                      ) : (
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                          GitHub Profile
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      {isEditing ? (
                        <Input
                          value={socialLinks.linkedin}
                          onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="flex-1 bg-gray-50 border-gray-300 text-gray-900 text-sm"
                          placeholder="LinkedIn profile URL"
                        />
                      ) : (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                          LinkedIn Profile
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Twitter className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      {isEditing ? (
                        <Input
                          value={socialLinks.twitter}
                          onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                          className="flex-1 bg-gray-50 border-gray-300 text-gray-900 text-sm"
                          placeholder="Twitter profile URL"
                        />
                      ) : (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm truncate">
                          Twitter Profile
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
