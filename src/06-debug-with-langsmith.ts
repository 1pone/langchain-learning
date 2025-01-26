import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { Calculator } from "@langchain/community/tools/calculator";
import model from "./models/openAI.ts";
import { ToolDefinition } from "@langchain/core/dist/language_models/base";

const tools: ToolDefinition[] = [
  new TavilySearchResults({
    verbose: true,
  }),
  new Calculator({
    verbose: true,
  }),
];

// Prompt template must have "input" and "agent_scratchpad input variables
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = createToolCallingAgent({
  llm: model,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: false,
});

const result = await agentExecutor.invoke({
  input:
    "Who directed the 2023 film Oppenheimer and what is their age? What is their age in days (assume 365 days per year)?",
});

console.log(result);
// {
//   input: "Who directed the 2023 film Oppenheimer and what is their age? What is their age in days (assume 365 days per year)?",
//   output: "The 2023 film Oppenheimer was directed by Christopher Nolan. Nolan was born on July 30, 1970, which makes him 53 years old as of now (October 2023). In days, that is approximately 19,345 days."
// }

/**
 * verbose
 */
// with verbose set to true, you can see the entire call chain from input to output
// [tool/start] [1:tool:TavilySearchResults] Entering Tool run with input: "Oppenheimer 2023 film director"
// [tool/start] [1:tool:TavilySearchResults] Entering Tool run with input: "Christopher Nolan age"
// [tool/end] [1:tool:TavilySearchResults] [4.03s] Exiting Tool run with output: "[{"title":"In 'Oppenheimer,' Christopher Nolan builds a thrilling, serious ...","url":"https://apnews.com/article/oppenheimer-christopher-nolan-469cc81e0989f414a20db5508c7630a0","content":"Director Christopher Nolan, producer Emma Thomas, Cillian Murphy, Emily Blunt, Robert Downey Jr., Florence Pugh, and Matt Damon pose for photographers at the photo call for the film 'Oppenheimer' on Wednesday, July 12, 2023 in London. (Vianney Le Caer/Invision/AP)","score":0.8437023,"raw_content":null},{"title":"Christopher Nolan Wins Best Director For Oppenheimer, His First Oscar ...","url":"https://screenrant.com/oscars-2024-best-director-christopher-nolan-wins-oppenheimer/","content":"Christopher Nolan finally wins his first Oscar for Best Director with Oppenheimer, a 2023 biographical thriller. Led by Cillian Murphy, Robert Downey Jr., and Emily Blunt, Oppenheimer set box office records and earned 13 Oscar nominations. ... Oppenheimer is a film by Christopher Nolan, which follows the theoretical physicist J. Robert","score":0.838376,"raw_content":null},{"title":"Oppenheimer (2023) - Full Cast & Crew - IMDb","url":"https://www.imdb.com/title/tt15398776/fullcredits/","content":"Oppenheimer (2023) cast and crew credits, including actors, actresses, directors, writers and more. Menu. ... director of photography: behind-the-scenes Jason Gary ... best boy grip ... film loader Luc Poullain ... aerial coordinator","score":0.77913743,"raw_content":null},{"title":"Oppenheimer (film) - Wikipedia","url":"https://en.wikipedia.org/wiki/Oppenheimer_(film)","content":"The film continued to hold well in the following weeks, making $32 million and $29.1 million in its fifth and sixth weekends.[174][175] As of September 10, 2023, the highest grossing territories were the United Kingdom ($72 million), Germany ($46.9 million), China ($46.8 million), France ($40.1 million) and Australia ($25.9 million).[176]\nCritical response\nThe film received critical acclaim.[a] Critics praised Oppenheimer primarily for its screenplay, the performances of the cast (particularly Murphy and Downey), and the visuals;[b] it was frequently cited as one of Nolan's best films,[191][192][183] and of 2023, although some criticism was aimed towards the writing of the female characters.[187] Hindustan Times reported that the film was also hailed as one of the best films of the 21st century.[193] He also chose to alternate between scenes in color and black-and-white to convey the story from both subjective and objective perspectives, respectively,[68] with most of Oppenheimer's view shown via the former, while the latter depicts a \"more objective view of his story from a different character's point of view\".[69][67] Wanting to make the film as subjective as possible, the production team decided to include visions of Oppenheimer's conceptions of the quantum world and waves of energy.[70] Nolan noted that Oppenheimer never publicly apologized for his role in the atomic bombings of Hiroshima and Nagasaki, but still desired to portray Oppenheimer as feeling genuine guilt for his actions, believing this to be accurate.[71]\nI think of any character I've dealt with, Oppenheimer is by far the most ambiguous and paradoxical. The production team was able to obtain government permission to film at White Sands Missile Range, but only at highly inconvenient hours, and therefore chose to film the scene elsewhere in the New Mexico desert.[2][95]\nThe production filmed the Trinity test scenes in Belen, New Mexico, with Murphy climbing a 100-foot steel tower, a replica of the original site used in the Manhattan Project, in rough weather.[2][95]\nA special set was built in which gasoline, propane, aluminum powder, and magnesium were used to create the explosive effect.[54] Although they used miniatures for the practical effect, the film's special effects supervisor Scott R. Fisher referred to them as \"big-atures\", since the special effects team had tried to build the models as physically large as possible. He felt that \"while our relationship with that [nuclear] fear has ebbed and flowed with time, the threat itself never actually went away\", and felt the 2022 Russian invasion of Ukraine had caused a resurgence of nuclear anxiety.[54] Nolan had also penned a script for a biopic of Howard Hughes approximately during the time of production of Martin Scorsese's The Aviator (2004), which had given him insight on how to write a script regarding a person's life.[53] Emily Blunt described the Oppenheimer script as \"emotional\" and resembling that of a thriller, while also remarking that Nolan had \"Trojan-Horsed a biopic into a thriller\".[72]\nCasting\nOppenheimer marks the sixth collaboration between Nolan and Murphy, and the first starring Murphy as the lead. [for Oppenheimer] in his approach to trying to deal with the consequences of what he'd been involved with\", while also underscoring that it is a \"huge shift in perception about the reality of Oppenheimer's perception\".[53] He wanted to execute a quick tonal shift after the atomic bombings of Hiroshima and Nagasaki, desiring to go from the \"highest triumphalism, the highest high, to the lowest low in the shortest amount of screen time possible\".[66] For the ending, Nolan chose to make it intentionally vague to be open to interpretation and refrained from being didactic or conveying specific messages in his work.","score":0.6977124,"raw_content":null},{"title":"Oppenheimer | Film, Plot, Actors, Reception, Awards, & Facts - Britannica","url":"https://www.britannica.com/topic/Oppenheimer-film","content":"Most of the film’s first two hours focus on events in Oppenheimer’s career leading up to the detonation of the first atomic bomb at the Trinity Site, and his relationships with other scientists; his wife, Kitty (Emily Blunt); his lover, Jean Tatlock (Florence Pugh), who is involved with the Communist Party of the United States of America (CPUSA); and the U.S. Army general overseeing the Manhattan Project, Leslie Richard Groves (Matt Damon). These sympathies are used against him in the 1950s government hearing, in which officials consider revoking his security clearance on the basis of accusations that he had associated with communists during the early days of World War II, that he had given conflicting testimony to the Federal Bureau of Investigation (FBI), and that he had opposed the development of the hydrogen bomb in 1949 and continued to lobby against it after Pres. Recent News\nOppenheimer,\nAmerican and British dramatic biographical film, released in 2023, that explores the life and legacy of the American physicist J. Robert Oppenheimer, who played a key role in the development of the atomic bomb. By this time Oppenheimer has become a vocal critic of the U.S. government’s role in the proliferation of nuclear weapons, and the loss of his security clearance would deal a significant blow to his reputation and credibility. These scenes are interspersed with depictions of a government hearing during the 1950s, in which Oppenheimer is forced to defend himself against challenges to his loyalty and patriotism, and a Senate confirmation hearing for Lewis Strauss (Robert Downey, Jr.), an antagonist of Oppenheimer who had been nominated to become U.S. secretary of commerce.\n","score":0.5835125,"raw_content":null}]"
// [tool/end] [1:tool:TavilySearchResults] [4.33s] Exiting Tool run with output: "[{"title":"Christopher Nolan - Age, Family, Bio | Famous Birthdays","url":"https://www.famousbirthdays.com/people/christopher-nolan.html","content":"Christopher Nolan is a British-American director, screenwriter, and producer born on July 30, 1970 in London. He is known for his acclaimed films such as Memento, The Dark Knight, Inception, and Oppenheimer.","score":0.8533396,"raw_content":null},{"title":"Christopher Nolan Wiki, Wife, Age, Height, Family, Biography & More","url":"https://famouspeople.wiki/christopher-nolan/","content":"Christopher Nolan is a British-American filmmaker born on 30 July 1970 in London. He is known for his acclaimed movies like Memento, The Dark Knight, Inception, and Dunkirk.","score":0.8066246,"raw_content":null},{"title":"Christopher Nolan Biography: Movies, Wife, Age, Net Worth, Children ...","url":"https://www.thecityceleb.com/biography/celebrity/filmmaker/christopher-nolan-biography-movies-wife-age-net-worth-children-instagram/","content":"Biography Christopher Edward Nolan (born July 30, 1970) is a renowned British-American filmmaker and producer. He has etched his name in the annals of cinematic history. Renowned for his Hollywood blockbusters adorned with intricately woven narratives, Nolan stands tall as a preeminent filmmaker of the 21st century. Among his opus, cinematic gems like Inception, The Dark Knight trilogy, and","score":0.75377536,"raw_content":null},{"title":"Christopher Nolan Height, Weight, Age, Affairs, Wife, Biography & More","url":"https://starsunfolded.com/christopher-nolan/","content":"Christopher Nolan Height, Weight, Age, Affairs, Wife, Biography & More Real NameChristopher Edward Nolan Birth PlaceWestminster, London, England CollegeUniversity College London FamilyFather- Brendan Nolan Mother- Christina Nolan Brothers- Matthew Francis Nolan,  Jonathan Nolan Favourite Things Favourite Graphic ArtistM. Daughter- Flora Nolan Some Lesser Known Facts About Christopher Nolan Christopher Nolan wins his first Golden Globe for Best Director of a Motion Picture for #Oppenheimer at the 2024 #GoldenGlobes pic.twitter.com/W6tNqgqtCb Christopher Nolan after winning awards at the at the 77th British Academy Film Arts Awards (BAFTA) Christopher Nolan after winning awards at the at the 77th British Academy Film Arts Awards (BAFTA) Follow us on our social media channels to stay connected. Report a problem? Socialize with StarsUnfolded","score":0.41748574,"raw_content":null},{"title":"Christopher Nolan - Wikipedia","url":"https://en.wikipedia.org/wiki/Christopher_Nolan","content":"In early 2003, Nolan approached Warner Bros. with the idea of making a new Batman film, based on the character's origin story.[58] Nolan was fascinated by the notion of grounding it in a more realistic world than a comic-book fantasy.[59] He relied heavily on traditional stunts and miniature effects during filming, with minimal use of computer-generated imagery (CGI).[60] Batman Begins (2005), the biggest project Nolan had undertaken to that point,[61] was released to critical acclaim and commercial success.[62][63] Starring Christian Bale as Bruce Wayne / Batman—along with Michael Caine, Gary Oldman, Morgan Freeman and Liam Neeson—Batman Begins revived the franchise.[64][65] Batman Begins was 2005's ninth-highest-grossing film and was praised for its psychological depth and contemporary relevance;[63][66] it is cited as one of the most influential films of the 2000s.[67] Film author Ian Nathan wrote that within five years of his career, Nolan \"[went] from unknown to indie darling to gaining creative control over one of the biggest properties in Hollywood, and (perhaps unwittingly) fomenting the genre that would redefine the entire industry\".[68]\nNolan directed, co-wrote and produced The Prestige (2006), an adaptation of the Christopher Priest novel about two rival 19th-century magicians.[69] He directed, wrote and edited the short film Larceny (1996),[19] which was filmed over a weekend in black and white with limited equipment and a small cast and crew.[12][20] Funded by Nolan and shot with the UCL Union Film society's equipment, it appeared at the Cambridge Film Festival in 1996 and is considered one of UCL's best shorts.[21] For unknown reasons, the film has since been removed from public view.[19] Nolan filmed a third short, Doodlebug (1997), about a man seemingly chasing an insect with his shoe, only to discover that it is a miniature of himself.[14][22] Nolan and Thomas first attempted to make a feature in the mid-1990s with Larry Mahoney, which they scrapped.[23] During this period in his career, Nolan had little to no success getting his projects off the ground, facing several rejections; he added, \"[T]here's a very limited pool of finance in the UK. Philosophy professor David Kyle Johnson wrote that \"Inception became a classic almost as soon as it was projected on silver screens\", praising its exploration of philosophical ideas, including leap of faith and allegory of the cave.[97] The film grossed over $836 million worldwide.[98] Nominated for eight Academy Awards—including Best Picture and Best Original Screenplay—it won Best Cinematography, Best Sound Mixing, Best Sound Editing and Best Visual Effects.[99] Nolan was nominated for a BAFTA Award and a Golden Globe Award for Best Director, among other accolades.[40]\nAround the release of The Dark Knight Rises (2012), Nolan's third and final Batman film, Joseph Bevan of the British Film Institute wrote a profile on him: \"In the space of just over a decade, Christopher Nolan has shot from promising British indie director to undisputed master of a new brand of intelligent escapism. He further wrote that Nolan's body of work reflect \"a heterogeneity of conditions of products\" extending from low-budget films to lucrative blockbusters, \"a wide range of genres and settings\" and \"a diversity of styles that trumpet his versatility\".[193]\nDavid Bordwell, a film theorist, wrote that Nolan has been able to blend his \"experimental impulses\" with the demands of mainstream entertainment, describing his oeuvre as \"experiments with cinematic time by means of techniques of subjective viewpoint and crosscutting\".[194] Nolan's use of practical, in-camera effects, miniatures and models, as well as shooting on celluloid film, has been highly influential in early 21st century cinema.[195][196] IndieWire wrote in 2019 that, Nolan \"kept a viable alternate model of big-budget filmmaking alive\", in an era where blockbuster filmmaking has become \"a largely computer-generated art form\".[196] Initially reluctant to make a sequel, he agreed after Warner Bros. repeatedly insisted.[78] Nolan wanted to expand on the noir quality of the first film by broadening the canvas and taking on \"the dynamic of a story of the city, a large crime story ... where you're looking at the police, the justice system, the vigilante, the poor people, the rich people, the criminals\".[79] Continuing to minimalise the use of CGI, Nolan employed high-resolution IMAX cameras, making it the first major motion picture to use this technology.[80][81]","score":0.29703185,"raw_content":null}]"
// [tool/start] [1:tool:Calculator] Entering Tool run with input: "53*365"
// [tool/end] [1:tool:Calculator] [4ms] Exiting Tool run with output: "19345"
// {
//   input: "Who directed the 2023 film Oppenheimer and what is their age? What is their age in days (assume 365 days per year)?",
//   output: 'The 2023 film "Oppenheimer" was directed by **Christopher Nolan**. He was born on **July 30, 1970**, making him **53 years old** as of now. \n' +
//     "\n" +
//     "In terms of age in days, he is approximately **19,345 days old** (calculated as 53 years times 365 days per year)."
// }

/**
 * langSmith
 */
// 使用 langSmith 进行调试，可以看到从input到output的整个调用链过程
// https://smith.langchain.com/public/72ed18a8-8da8-4f25-8a89-66e9c5c20223/r
