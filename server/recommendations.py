import pandas
import numpy
from sklearn.metrics.pairwise import cosine_similarity
from database import Database

# 1. https://www.w3schools.com/python/python_classes.asp
# 2. https://www.geeksforgeeks.org/python-find-dictionary-matching-value-in-list/
# 3. https://www.geeksforgeeks.org/complexity-cheat-sheet-for-python-operations/
# 4. https://datastax.medium.com/how-to-implement-cosine-similarity-in-python-505e8ec1d823#:~:text=If%20the%20cosine%20similarity%20is,directions%20and%20are%20perfectly%20dissimilar.



class Recommendations:

    @staticmethod
    def GetRecommendations(currGroup):

        

        # Calls database for distinct Group/URL pairs.
        URLGroupPairs = Database.SearchDatabase(table = "MGOLAN.GroupResources", columns=["GroupID", "WebsiteURL"], rows="PublicShare = 1", distinct='Yes')

        # Creates sets of groups and URLs
        distinctGroups = set()
        distinctURLs = set()
        for pair in URLGroupPairs:
            distinctGroups.add(pair[0])
            distinctURLs.add(pair[1])

        # Creates lists and dictionaries for low complexity use later on.
        distinctGroupsList = list(distinctGroups)
        distinctURLsList = list(distinctURLs)
        groupIndexDict = {}
        urlIndexDict = {}

        # Return non if currGroup not in list
        if currGroup not in distinctGroupsList:
            print("Output")
            print(currGroup)
            print(distinctGroupsList)
            return ("Error: Group does not have public resources")

        # Populates dictionaries
        for i, id in enumerate(distinctGroupsList):
            groupIndexDict[id] = i
        for i, url in enumerate(distinctURLsList):
            urlIndexDict[url] = i


        # Constructs matrix, populates with default values of zero.
        matrix = numpy.zeros((len(distinctGroupsList), len(distinctURLsList)))


        # Replaces 0s with 1s to signify pair
        for pair in URLGroupPairs:
            groupIndex = groupIndexDict[pair[0]]
            urlIndex = urlIndexDict[pair[1]]
            matrix[groupIndex][urlIndex] = 1


        # Calculate cosine similarity and stores groupIds with similarities above 0.4 (lower than ideal to allow for functionality demonstration w/ small user base)
        similarityMatrix = cosine_similarity(matrix)
        relevantRow = similarityMatrix[groupIndexDict[currGroup]]
        similarGroupIDs = []
        for i, score in enumerate(relevantRow):
            if score > 0.4 and i != groupIndexDict[currGroup]:
                similarGroupIDs.append(distinctGroupsList[i])

        if len(similarGroupIDs) <= 0:
            return ("Error: No sufficently similar groups")

        # Crafts query and calls database to get resources shared by similar groups that are not already shared by the current user.
        constraintString = str(similarGroupIDs[0])
        for i, id in enumerate(similarGroupIDs):
            if i != 0:
                constraintString = constraintString + ", " + str(similarGroupIDs[i])
        
        return Database.SelectQuery(f"SELECT sub.WebsiteURL, MGOLAN.EducationalResources.ResourceName,  MGOLAN.EducationalResources.ResourceCategory,  MGOLAN.EducationalResources.ResourceDescription,  MGOLAN.EducationalResources.Votes, MGOLAN.EducationalResources.ResourceID FROM (SELECT WebsiteURL FROM MGOLAN.GroupResources WHERE PublicShare = 1 AND GroupID IN ({constraintString}) AND WebsiteURL NOT IN (SELECT WebsiteURL FROM MGOLAN.GroupResources WHERE GroupID = {currGroup})) sub LEFT JOIN MGOLAN.Websites ON MGOLAN.Websites.PageURL = sub.WebsiteURL LEFT JOIN MGOLAN.EducationalResources ON MGOLAN.Websites.BaseURL = MGOLAN.EducationalResources.WebsiteURL")
