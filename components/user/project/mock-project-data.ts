import { ProjectWithRelations } from "@/types/project-types";

// Note: You might need to cast this as ProjectWithRelations if your types are strict,
// but for a mock, this structure matches your Prisma schema.

export const MOCK_PROJECT: any = {
    id: "proj_123",
    name: "The Solar System Exploration",
    description: "I need to create a presentation about the inner and outer planets, focusing on what makes Earth unique and the possibility of life on Mars. I also need to include fun facts about the gas giants.",
    coverImage: "https://images.unsplash.com/photo-1614730341194-75c60740a270?q=80&w=2000&auto=format&fit=crop",
    status: "IN_PROGRESS",
    dueDate: new Date("2023-12-20"),
    category: "Science",
    grade: "Grade 5",
    ownerId: "user_1",
    familyId: "fam_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Relationships
    notes: [], 
    chats: [], 
    
    researches: [
        {
            id: "res_1",
            title: "Mars: The Red Planet",
            criteria: "Find out why Mars is red, if there is water, and look for pictures of the Rover.",
            createdAt: new Date("2023-10-01"),
            updatedAt: new Date(),
            webLinks: [
                { id: "w1", url: "https://nasa.gov/mars-exploration", type: "WEB", summary: "Official NASA page" },
                { id: "w2", url: "https://nationalgeographic.com/mars", type: "WEB", summary: "Nat Geo article" },
                { id: "w3", url: "https://space.com/mars-facts", type: "WEB", summary: "Fun facts" },
            ],
            ytLinks: [
                { id: "y1", url: "https://youtube.com/watch?v=mars_rover_landing", type: "VIDEO", summary: "Curiosity Landing" },
                { id: "y2", url: "https://youtube.com/watch?v=is_there_life", type: "VIDEO", summary: "Life on Mars doc" },
            ],
            imgLinks: [
                { id: "i1", url: "https://images.unsplash.com/photo-1614728853975-69c77063ac00?auto=format&fit=crop&w=1000", type: "IMAGE" },
                { id: "i2", url: "https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=1000", type: "IMAGE" },
            ],
            overallSummary: `### 🎯 Key Objectives
Based on your links, here is what we found about Mars:

- **Water Exists:** Recent studies confirm **liquid water** beneath the south pole. This changes how we view habitability [NASA Report](source:w1).
- **Thin Atmosphere:** The air is mostly Carbon Dioxide, making it impossible for humans to breathe without suits.

### 🎥 Visual Evidence
The rover landing was a critical moment for exploration. You can see the distinct red dust clouds during the descent [Rover Landing Footage](source:y1).

> "Mars is the only other planet we believe humans could inhabit in the near future."`,
        },
        {
            id: "res_2",
            title: "Gas Giants (Jupiter & Saturn)",
            criteria: "Focus on the rings of Saturn and the Great Red Spot on Jupiter.",
            createdAt: new Date("2023-10-05"),
            updatedAt: new Date(),
            webLinks: [
                { id: "w4", url: "https://wikipedia.org/wiki/Jupiter", type: "WEB" }
            ],
            ytLinks: [],
            imgLinks: [
                { id: "i3", url: "https://images.unsplash.com/photo-1614732414444-096e6f11c6d7?auto=format&fit=crop&w=1000", type: "IMAGE" }
            ],
            
        },
        {
            id: "res_3",
            title: "Pluto & Dwarf Planets",
            criteria: "Why isn't Pluto a planet anymore? Find an explainer video.",
            createdAt: new Date("2023-10-10"),
            updatedAt: new Date(),
            webLinks: [],
            ytLinks: [],
            imgLinks: [],
            overallSummary: null,
        }
    ]
};