# Import modules
import arcpy

# Set the workspace environment
arcpy.env.workspace = r"C:\Users\Hope McBride\OneDrive - UW-Madison\GEOG 579\Module 1\Lab 0\Lab0\PrelabData"

# Get a list of the feature classes in the current directory
datasets = arcpy.ListFeatureClasses()
# print("Feature Classes in the current directory:")
# for dataset in datasets:
#     print(dataset)
# print()

# Get a list of rasters in the current directory
datasets = arcpy.ListRasters()
# print("Raster datasets in the current directory:")
# for dataset in datasets:
#     print(dataset)
# print ()


# Print various dataset properties for vector dataset 'continent'
dscVec = arcpy.Describe("continent")
print("Name: ", dscVec.baseName)
print("Data Type: ", dscVec.dataType)
print("Spatial Reference: ", dscVec.spatialReference.name)
print("Shape Type: ", dscVec.shapeType)
print()

# Print various raster dataset properties for raster dataset 'dem'
dscRas = arcpy.Describe("dem")
print("Name: ", dscRas.baseName)
print("Data Type: ", dscRas.dataType)
print("Spatial Reference: ", dscRas.spatialReference.name)
print("Band Count: ", dscRas.bandCount)
print()

# Define projection for dem
arcpy.management.DefineProjection("dem", 32647)

dscRas = arcpy.Describe("dem")
print("Spatial Reference: ", dscRas.spatialReference.name)

# cut from for loop:     print("Spatial Reference: ", desdirDatasets.spatialReference.name)




# # Print various dataset properties for vector dataset 'continent'
# dscVec = arcpy.Describe("continent")
# print("Name: ", dscVec.baseName)
# print("Data Type: ", dscVec.dataType)
# print("Spatial Reference: ", dscVec.spatialReference.name)
# print("Shape Type: ", dscVec.shapeType)
# print()

# # Print various raster dataset properties for raster dataset 'dem'
# dscRas = arcpy.Describe("dem")
# print("Name: ", dscRas.baseName)
# print("Data Type: ", dscRas.dataType)
# print("Spatial Reference: ", dscRas.spatialReference.name)
# print("Band Count: ", dscRas.bandCount)
# print()

# dscStream = arcpy.Describe("p14stream")
# print("Name: ", dscStream.baseName)
# print("Data Type: ", dscStream.dataType)
# print("Spatial Reference: ", dscStream.spatialReference.name)
# print()

# dscContour = arcpy.Describe("contour")
# print("Name: ", dscContour.baseName)
# print("Data Type: ", dscContour.dataType)
# print("Spatial Reference: ", dscContour.spatialReference.name)
# print()


# for dataset in 

# Import modules
import arcpy

# Set the workspace environment
arcpy.env.workspace = r"C:\Users\Hope McBride\OneDrive - UW-Madison\GEOG 579\Module 1\Lab 0\Lab0\PrelabData"

# Get a list of the feature classes in the current directory
datasets = arcpy.ListFeatureClasses()
print("Feature Classes in the current directory:")
for dataset in datasets:
    print(dataset)
print()

# Get a list of rasters in the current directory
rasterdatasets = arcpy.ListRasters()
print("Raster datasets in the current directory:")
for dataset in rasterdatasets:
    print(dataset)
print ()

# Combine feature classes/shapefiles and rasters into one group
dirDatasets = datasets + rasterdatasets
# check that the combination was successful
print(dirDatasets)
print()

# set up a for-loop + if-loop to identify and change any incorrect spatial reference to the correct WGS 1984 spatial reference
for dataset in dirDatasets:
    desdirDatasets = arcpy.Describe(dataset)
    # This if-loop will ensure the spatial references for all datasets are the same (WGS 1984). If I was only concerned about identifing spatial references labeled 'unknown', the code could say:   if desdirDatasets.spatialReference.name = "Unknown":
    if desdirDatasets.spatialReference.name != "GCS_WGS_1984":
       # Define projection 
        arcpy.management.DefineProjection(desdirDatasets, 4326)
    print("Spatial Reference: ", desdirDatasets.spatialReference.name)
print()





