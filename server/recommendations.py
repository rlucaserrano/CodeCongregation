import pandas
import numpy
from sklearn.metrics.pairwise import cosine_similarity
from database import Database

# 1. https://www.w3schools.com/python/python_classes.asp
# 2. https://www.geeksforgeeks.org/python-find-dictionary-matching-value-in-list/
# 3. https://www.geeksforgeeks.org/complexity-cheat-sheet-for-python-operations/
# 4. https://datastax.medium.com/how-to-implement-cosine-similarity-in-python-505e8ec1d823#:~:text=If%20the%20cosine%20similarity%20is,directions%20and%20are%20perfectly%20dissimilar.

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

# Populates dictionaries
for i, id in enumerate(distinctGroupsList):
    groupIndexDict[id] = i
for i, url in enumerate(distinctURLsList):
    urlIndexDict[url] = i


# Constructs matrix, populates with default values of zero.
matrix = numpy.zeros(len(distinctGroupsList), len(distinctURLsList))


# Replaces 0s with 1s to signify pair
for pair in URLGroupPairs:
    groupIndex = groupIndexDict[pair[0]]
    urlIndex = urlIndexDict[pair[1]]
    matrix[groupIndex][urlIndex] = 1


# Calculate cosine similarity
similarityMatrix = cosine_similarity(matrix)

# Next steps

# 1. Determine two/three similar groupIDs. 
# 2. Call the database again there public resources.
# 3. Remove public resources already owned by group.
# 4. Return remaining files to frontend.

