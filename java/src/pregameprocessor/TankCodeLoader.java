package pregameprocessor;

import database.DBTank;
import database.GameDatabase;
import database.GameDatabaseImpl;
import game.board.elements.Tank;
import game.util.JavaSourceFromString;
import org.bson.types.ObjectId;

import javax.tools.*;
import java.io.File;
import java.lang.reflect.Constructor;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by nathand on 12/1/15.
 */
public class TankCodeLoader {

	// public members
	//public static File tankCodeDirectory = new File("./tankCode/");
    public static GameDatabase db = GameDatabaseImpl.getSingleton();
    public static String compiledTankCodeDirectory = "./compiledTanks/";
    
    // private members
    private static String tankClassLoc = "game.board.elements.Tank";
    private static final String CLASS_STR = "public class ";
    private static final String IMPORT_STR = "import";
    private static final String PACKAGE_STR = "package ";
    private static final String THREAD_STR = "new Thread(";
    private static final String RUNNABLE_STR = "new Runnable(";
    private static final String EXT_THREAD_STR = "extends Thread";
    private static final String THREAD_CALL_STR = "Thread.";
    private static final String SEMICOLON = ";";
    private static final String SL_COMMENT_OPEN = "//";
    private static final char SL_COMMENT_CLOSE = '\n';
    private static final String ML_COMMENT_OPEN = "/*";
    private static final String ML_COMMENT_CLOSE = "*/";
    
    
    // approved Java package name patterns
    private static final String[] APPROVED_PACKAGES = {
    	"\\s*game.*",
    	"\\s*org\\.bson.*",
    	"\\s*org\\.mongodb.*",
    	"\\s*java\\.util.*"
    };

    public static Tank loadTank(ObjectId tankId, String name) {
        try {
        	
        	// 0) get info and tank code text
            DBTank tank = db.loadDBTank(tankId);
            String code = tank.getCode();
            
            // 1) Rename the tank to guarantee unique tank class names
        	// 		within the game
            code = replaceTankClassName(code, name);
            
            // 2) Remove all code before imports
            //	WARNING: must be called before removing unapproved imports
            //	or else code will become jumbled!!!!!
            code = removePackageDeclaration(code);
            
            // 3) Remove all imports that aren't whitelisted
            code = removeUnapprovedImports(code);
            
            // 4) Remove calls that can create threads
            code = removeThreadAndRunnableCalls(code);

            // 5) Take the code out
            //		Save it to a file
            JavaFileObject file = new JavaSourceFromString(name, code);

            // 6) Set up variables (classpath) necessary
            JavaCompiler comp = ToolProvider.getSystemJavaCompiler();

            //DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<JavaFileObject>();
            //StandardJavaFileManager fileManager = comp.getStandardFileManager(diagnostics, null, null);

            Iterable<? extends JavaFileObject> compilationUnits = Arrays.asList(file);

            StandardJavaFileManager fileManager = comp.getStandardFileManager( null, null, null);
            fileManager.setLocation(StandardLocation.CLASS_OUTPUT,Arrays.asList(new File("src")));
            JavaCompiler.CompilationTask task = comp.getTask(null, fileManager,null,null, null, compilationUnits);
            //for (Diagnostic diagnostic : diagnostics.getDiagnostics())
            //    System.out.format("Error on line %d in %s%n",
            //            diagnostic.getLineNumber(),
            //            diagnostic.getSource().toString());

            //fileManager.close();
            //System.err.println(name);
            boolean success = task.call();

            if (success) {
                try {
                    File f = new File("src");
                    //System.err.println(f.toURI().toURL());
                    URLClassLoader classLoader = URLClassLoader.newInstance(new URL[]{f.toURI().toURL()});
                    Class<?> cs = Class.forName(name, true, classLoader);
                    Constructor<?> ctor = cs.getConstructor(ObjectId.class, String.class, int.class);
                    Tank t = (Tank) ctor.newInstance(tankId, "My Tank", 3);
                    return t;
                } catch (Exception e) {
                    System.err.format("Reflection failed");
                    e.printStackTrace();
                    return null;
                }
            } else {
                System.err.format("Failed to compile class. Loc: %s%n", name);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    //
    // Private methods
    //
    
    private static String replaceTankClassName(String code, String tankName) {
    	
    	// find the class declaration
        int start = code.indexOf(CLASS_STR) + CLASS_STR.length();
        int end = code.indexOf(" ", start);
        String nName = code.substring(start, end);
        
        // replace provided classname with unique identifying one from us
        code = code.replaceAll(nName, tankName + " ");
        return code;
    }
    
    private static String removeThreadAndRunnableCalls(String code) {
    	
    	// Right now, there's no guaranteed security setup
    	// So, we want to prevent user code from creating Threads or Runnable
    	// objects. This might leave their code butchered, as it does not attempt 
    	// clean removal, but they surrendered that right when they injected
    	// this kind of crap, IMHO.
    	//
    	// WARNING: currently not comment-safe (will remove instances of 
    	// these strings from comments as well as live code)
    	
    	code = code.replace(THREAD_STR, "/*Thou shalt cling unto thine own thread!*/");
    	code = code.replace(RUNNABLE_STR, "/*Thou shalt cling unto thine own thread!*/");
    	code = code.replace(EXT_THREAD_STR, "/*Thou shalt cling unto thine own thread!*/");
    	code = code.replace(THREAD_CALL_STR, "/*Thou shalt cling unto thine own thread!*/");
    	return code;
    }
    
    private static String removePackageDeclaration(String code) {
    	
    	// Q: WHY ARE WE DOING THIS BY HAND? IT'S SO UGLY!
    	// I originalyl did the hand parsing because I was calling the code
    	// sanitations methods out of order and it was causing string 
    	// foolishness I couldn't track down.
    	//
    	// However, now that bug is solved, this is still cleaner, easier
    	// to read code than the "more abstract" use of indexOf() to track
    	// comments and import statements, and it works. So... don't fix
    	// what isn't broken.
    	
    	// Q: WHY NOT JUST REMOVE PACKAGE STATEMENTS? WHY THE MASSIVE FILE CHOP?
    	// For overkill safety, with a guarantee that a valid, compilable Java file
    	// will suffer no damage from it anyway
    	
    	// Looking for the first valid import statement and removing everything before it
    	// Why not just find the package statement? because that would require we find *all*
    	// package statements; otherwise, someone could have 2 package statements, we'd
    	// remove the first one, then their 2nd package statement would be left to happily
    	// compile even though their original code would not have.
    	
    	int i = -1;
    	boolean isLineComment = false;
    	boolean isBlockComment = false;
    	
    	while(++i < code.length()) {
    		
    		//System.out.println(String.format("...char: \"%c\" at i:%d", code.charAt(i), i));
    		switch (code.charAt(i)) {
    		
    		case '/':
    			if (i+1 < code.length()) {
	    			if (code.charAt(i+1) == '/' && !isBlockComment) {
	    				// we've found a line comment!
	    				isLineComment = true;
	    				i++;
	    			}
	    			else if (code.charAt(i+1) == '*' && !isLineComment) {
	    				// we've found a multi-line comment!
	    				isBlockComment = true;
	    				i++;
	    			}
    			}
    			break;
    			
    		case '*':
    			if (i+1 < code.length()) {
	    			if (code.charAt(i+1) == '/' && !isLineComment) {
	    				// we're ending a multiline!
	    				isBlockComment = false;
	    				i++;
	    			}
    			}
    			break;
    			
    		case '\n':
    			isLineComment = false;
    			break;
    			
    		case 'i':
    			if (i+IMPORT_STR.length() < code.length()) {
	    			if (code.substring(i, i+IMPORT_STR.length()).equals(IMPORT_STR)
	    					&& !isLineComment && !isBlockComment) {
	    				
	    				// found an un-commented import statement!
	    				// remove all text before it, as it's all possibly-valid
	    				// package statement(s) and comments!
	    				code = code.substring(i);
	    				return code;
	    			}
    			}
    			break;
    			
    		case 'p':
    			if (i+CLASS_STR.length() < code.length()) {
    				if (code.substring(i, i+CLASS_STR.length()).equals(CLASS_STR)
    						&& !isLineComment && !isBlockComment) {
    					
    					// found an un-commented class declaration!
    					// if we made it here, then there were no valid import
    					// statements, so this definitely won't work as a tank
    					// Nevertheless, having been born of thorough parents, I'll
    					// remove everything before it anyway to guarantee no
    					// package statement exists!
    					//
    					// (Note: this will remove the @Embedded annotation, but again:
    					// doesn't matter, it won't work as a tank anyway)
    					code = code.substring(i);
    					return code;
    				}
    			}
    			break;
    			
    		default:
    			break;
    			
    		}
    	}
    	
    	// If we're still here, it means there were no valid import statements
    	// AND no valid class declaration! Yikes.
    	//
    	// I guess we'll leave it untouched, as there's no valid Java file that
    	// meets those parameters, so we're at no risk anyway.
    	return code;
    }
    
    private static String removeUnapprovedImports(String code) {
    	
    	// pre-compile regex patterns for acceptable package names
    	Pattern[] packagePatterns = new Pattern[APPROVED_PACKAGES.length];
    	for(int i=0; i<APPROVED_PACKAGES.length; i++) {
    		packagePatterns[i] = Pattern.compile(APPROVED_PACKAGES[i]);
    	}
    	
    	// find each import statement
        int start = 0;
        int packageIdx = 0;
        int end = 0;
        int lastImport = 0;
        while (start != -1) {
        	
        	// identify substring location
        	start = code.indexOf(IMPORT_STR, lastImport);
        	packageIdx = start + IMPORT_STR.length();
        	end = code.indexOf(SEMICOLON, packageIdx);
        	
        	// stop searching if we're out of imports
        	if (start == -1) {
        		break;
        	}
        	
        	// extract package name, and check it for approval
        	String packageInQuestion = code.substring(packageIdx, end);
        	boolean packageApproved = false;
        	for(int i=0; i<packagePatterns.length; i++) {
        		Matcher match = packagePatterns[i].matcher(packageInQuestion);
        		if (match.find()) {
        			packageApproved = true;
        			break;
        		}
        	}
        	
        	// remove the package declaration if it is NOT approved
        	// set the "checked up to" index to either the end of this import
        	// or to where we removed it from appropriately
        	if (!packageApproved) {
        		code = code.replace(code.substring(start, end+1), "");
        		lastImport = start;
        	} else {
        		lastImport = end;
        	}
        }
        
        return code;
    }
}
